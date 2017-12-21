export default function(_query, followUpStatements) {
  const query = Object.assign({}, _query);
  followUpStatements.forEach((statement) => {
    Object.defineProperty(query, statement.name, {
      get() {
        return statement({ query, followUpStatements });
      },
      enumerable: false
    })
  });
  return query;
}