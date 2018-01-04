// import Insert from './insert';
import Select from './select';
import Update from './update';
// import Delete from './delete';

import Where from './where';
import Returning from './returning';

import Submit from './submit';

export default function({properties, submitHandler, collectionName}) {

  // const insert = Insert(properties);
  const select = Select(properties);
  const update = Update(properties);
  // const remove = Delete(properties);
  
  const where = Where(properties);
  const returning = Returning(properties);

  const submit = Submit(submitHandler);

  const context = {
    insert(callback) {
      const statementChain = [returning, submit];
      const query = insert({query: {collectionName: collectionName}, statementChain})(callback);
      return query;
    },
    select(callback) {
      const statementChain = [where, submit];
      const query = select({query: {collectionName: collectionName}, statementChain})(callback);
      return query;
    },
    update(callback) {
      const statementChain = [where, returning, submit];
      const query = update({query: {collectionName: collectionName}, statementChain})(callback);
      return query;
    },
    delete(callback) {
      const statementChain = [where, returning, submit];
      const query = remove({query: {collectionName: collectionName}, statementChain})(callback);
      return query;
    },
  }

  return context;
}