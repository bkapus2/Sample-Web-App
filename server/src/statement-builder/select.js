import R from 'ramda';
import where from './where';

const select = function(properties, cb) {

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

  return function(cb) {
    return { select: cb(propertyContext) };
  }
};

export default select;