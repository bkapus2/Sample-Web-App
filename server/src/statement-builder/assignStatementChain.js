export default function(_query, statementChain) {
  const query = Object.assign({}, _query);
  statementChain.forEach((statement) => {
    Object.defineProperty(query, statement.name, {
      get() {
        return statement({ query, statementChain });
      },
      enumerable: false
    })
  });
  return query;
}