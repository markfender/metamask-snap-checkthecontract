// curl 'https://arweave.net/graphql' -H 'Content-Type: application/json' -H 'Accept: application/json' --data-binary '{"query":"{\n    transactions(\n      owners:[\"CLdrLPJIxcEUusjw1xSipBIuiternhu6RwSUu1Kv0XQ\"],\n      tags: [{\n        name: \"App-Name\",\n        values: [\"audited-contracts-demo\"]\n      },{\n            name: \"Contract-Address\",\n            values: [\"0x326C977E6efc84E512bB9C30f76E30c160eD06FB\"]\n      }\n      ]\n    ) {\n        edges {\n            node {\n                id\n            }\n        }\n    }\n}\n"}'

// eslint-disable-next-line jsdoc/require-jsdoc
export async function getZebraInsights(_address: string) {
  const address = '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5';
  const response = await fetch('https://arweave.net/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: `{"query": "{transactions(owners:[\"CLdrLPJIxcEUusjw1xSipBIuiternhu6RwSUu1Kv0XQ\"],tags: [{name: \"App-Name\",values: [\"audited-contracts-demo\"]},{name:\"Contract-Address\",values: [\"0x326C977E6efc84E512bB9C30f76E30c160eD06FB\"]}]) {edges {node {id}}}}"}`,
  });

  return { c: await response.text() };
  const result = await response.json();
  const id = result.transactions.edges[0]?.node.id;

  if (!id) {
    return {};
  }

  const auditResponse = await fetch(
    `https://zkwhtbvrkecbifq6gau76g6tfhkaa656xi3lejgzklsxh7mfi7tq.arweave.net/${id}`,
  );
  const auditResult = await auditResponse.json();
  return auditResult;
}
