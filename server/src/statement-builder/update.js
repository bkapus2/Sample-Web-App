import assignstatementChain from './assignStatementChain';

const logicStatement = function(operation){
  return function({property, defaultArgument, argumentRequired=false}) {
    return function(argument) {
      if (argument === undefined && argumentRequired) {
        throw new Error(`Required argument not provided for ${property}.${operation}()`)
      }
      return {
        operation,
        property,
        argument: argument === undefined ? defaultArgument : argument,
      }
    }
  }
};
const set = logicStatement('set');
const increment = logicStatement('increment');
const decriment = logicStatement('decriment');

const keyValueMap = {
  TEXT({key}) {
    return {
      set: set({property: key}),
    }
  },
  INTEGER({key}) {
    return {
      set: set({property: key}),
      increment: increment({property: key, defaultArgument: 1}),
      decriment: decriment({property: key, defaultArgument: 1}),
    }
  },
  BOOLEAN({key}) {
    return {
      set: set({property: key}),
    }
  },
  default({type}) {
    throw new Error(`Unsupported type (${type}).`);
  }
}

export default function(properties) {

  // convert each property to an object of functions specific to it's type
  const propertyContext = properties.reduce((accumulator, {key, column, type}) => {
    accumulator[key] = (keyValueMap[type] || keyValueMap.default)({key, column, type});
    return accumulator;
  }, {});
  
  return function update({ query, statementChain }) {
    return function(callback) {
      const value = callback(propertyContext);

      // check that the callback returned a value
      if (typeof value !== 'object') {
        throw new TypeError('update statement callback did not provide a return value.')
      }

      const _query = Object.assign({}, query, {
        update: value
      });
      
      return assignstatementChain(_query, statementChain);
    }
  }
}