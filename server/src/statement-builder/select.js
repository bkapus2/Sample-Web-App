import assignstatementChain from './assignStatementChain';
import pluck from './../util/pluck'

export default function(properties) {

  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    accumulator[key] = key;
    return accumulator;
  },{});

  return function select({query, statementChain }) {
    
    // give access to an all object, which can remove certain keys
    const keys = properties.map(pluck('key'));
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

    return function(callback) {
      let value;

      // if we have a callback
      if (callback) {
        value = callback(propertyContext);

        // check that the callback returned a value
        if (!value) {
          throw new TypeError('select statement callback did not provide a return value.')
        }
        
        // wrap single values in an array
        if (!Array.isArray(value)) {
          value = [value];
        }
      }

      // if we do not have a callback assume we are selecting all keys
      else {
        value = keys;
      }

      const _query = Object.assign({}, query, {
        select: value.length === properties.length ? "all" : value
      });

      return assignstatementChain(_query, statementChain);
    }
  }
};