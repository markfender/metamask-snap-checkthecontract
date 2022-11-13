const whitelist: readonly string[] = [
  '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
];

// eslint-disable-next-line jsdoc/require-jsdoc
export async function getZebraInsights(address: string) {
  const whitelistedAddress = whitelist.includes(address)
    ? address
    : whitelist[0];
  const response = await fetch('https://arweave.net/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: `{"query":"{\\n    transactions(\\n      owners:[\\"CLdrLPJIxcEUusjw1xSipBIuiternhu6RwSUu1Kv0XQ\\"],\\n      tags: [{\\n        name: \\"App-Name\\",\\n        values: [\\"audited-contracts-demo\\"]\\n      },{\\n            name: \\"Contract-Address\\",\\n            values: [\\"${whitelistedAddress}\\"]\\n      }\\n      ]\\n    ) {\\n        edges {\\n            node {\\n                id\\n            }\\n        }\\n    }\\n}\\n"}`,
  });

  const result = await response.json();
  const id = result.data.transactions.edges[0]?.node.id;

  let auditResult;
  if (id) {
    const auditResponse = await fetch(
      `https://zkwhtbvrkecbifq6gau76g6tfhkaa656xi3lejgzklsxh7mfi7tq.arweave.net/${id}`,
    );
    auditResult = await auditResponse.json();
  }
  return {
    'Security audits': id
      ? `✅ Audited by ${auditResult.auditingCompany}`
      : '⛔️ No',
    Upgradable: await checkIfUpgradable(whitelistedAddress),
  };
}

// eslint-disable-next-line jsdoc/require-jsdoc
export async function checkIfUpgradable(contractAddress: string) {
  const code =
    (await wallet?.request({
      method: 'eth_getCode',
      params: [contractAddress],
    })) || '';

  const listOfUpgradableFunctions = ['5c60da1b', '3659cfe6']; // ['implementation()', 'upgradeTo(address)'];
  const isUpgradable = listOfUpgradableFunctions
    .map(
      (functionSignature: string): boolean =>
        code.toString().indexOf(functionSignature) > 0,
    )
    .includes(true);

  return isUpgradable
    ? '❗️ Yes'
    : '✅ No (upgrdability patter was not detected)';
}
