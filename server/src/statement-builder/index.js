// import Insert from './insert';
import Select from './select';
import Update from './update';
// import Delete from './delete';

import Where from './where';
import Returning from './returning';

export default function(properties) {

  // const insert = Insert(properties);
  const select = Select(properties);
  const update = Update(properties);
  // const remove = Delete(properties);
  
  const where = Where(properties);
  const returning = Returning(properties);

  const context = {
    insert(callback) {
      const followUpStatements = [returning];
      const query = insert({followUpStatements})(callback);
      return query;
    },
    select(callback) {
      const followUpStatements = [where];
      const query = select({followUpStatements})(callback);
      return query;
    },
    update(callback) {
      const followUpStatements = [where, returning];
      const query = update({followUpStatements})(callback);
      return query;
    },
    delete(callback) {
      const followUpStatements = [where, returning];
      const query = remove({followUpStatements})(callback);
      return query;
    },
  }

  return context;
}