import Web3 from 'web3';

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

  if (!id) {
    return {};
  }

  const auditResponse = await fetch(
    `https://zkwhtbvrkecbifq6gau76g6tfhkaa656xi3lejgzklsxh7mfi7tq.arweave.net/${id}`,
  );
  const auditResult = await auditResponse.json();
  return auditResult;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export async function checkIfUpgradable(contractAddress: string) {
  const web3Init = new Web3(
    new Web3.providers.HttpProvider(
      'https://eth-mainnet.g.alchemy.com/v2/e_wJdrZ4qnlaDJ96hvsqPuySrP3qXdt6', // "https://eth-goerli.g.alchemy.com/v2/JwhZlH7Fw8FkoNVPsGmt_g9J3FnIeTT8"
    ),
  );

  const code = await web3Init.eth.getCode(contractAddress);

  const listOfUpgradableFunctions = ['implementation()', 'upgradeTo(address)'];
  const isUpgradable = listOfUpgradableFunctions
    .map(
      (functionSignature: string): boolean =>
        code.indexOf(
          web3Init.eth.abi
            .encodeFunctionSignature(functionSignature)
            .slice(2, 10),
        ) > 0,
    )
    .includes(true);

  console.log('isSigPresent', isUpgradable);
  return isUpgradable;
}
