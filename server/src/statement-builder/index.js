// import Insert from './insert';
import Select from './select';
import Update from './update';
// import Delete from './delete';

import Where from './where';

export default function(properties) {

  // const insert = Insert(properties);
  const select = Select(properties);
  const update = Update(properties);
  // const remove = Delete(properties);
  
  const where = Where(properties);

  const context = {
    insert(callback) {
      const query = insert({})(callback);
      return {}
    },
    select(callback) {
      const query = select({})(callback);
      return {
        where: where(query)
      }
    },
    update(callback) {
      const query = update({})(callback);
      return {
        where: where(query)
      }
    },
    delete(callback) {
      const query = remove({})(callback);
      return {
        where: where(query)
      }
    },
  }

  return context;
}