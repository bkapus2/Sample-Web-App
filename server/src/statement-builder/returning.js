import R from 'ramda';
import assignFollowUpStatements from './assignFollowUpStatements';

export default function(properties) {

  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    accumulator[key] = key;
    return accumulator;
  },{});

  // give access to an all object, which can remove certain keys
  const keys = R.pluck('key', properties);
  const removeFromKeys = function(item) {
    const index = keys.indexOf(item);
    if (index > -1)
      keys.splice(index, 1);
  }
  Object.defineProperty(keys, 'except', {
    value(...args) {
      args.forEach(removeFromKeys);
      return keys;
    }
  })
  propertyContext.all = keys;

  return function returning({ query, followUpStatements }) {
    const indexOfStatement = followUpStatements.findIndex( statement => statement.name === 'returning');
    followUpStatements = followUpStatements.slice(indexOfStatement+1);
    return function(callback) {
      let value = callback(propertyContext);
      if (Array.isArray(value)) {
        value = [value];
      }
      const _query = Object.assign({}, query, {
        returning: value
      });
      return assignFollowUpStatements(_query, followUpStatements);
    }  
  }
};