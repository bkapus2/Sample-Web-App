import assignFollowUpStatements from './assignFollowUpStatements';

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
  
  return function update({ followUpStatements }) {
    return function(callback) {
      const query = {
        update: callback(propertyContext)
      };
      return assignFollowUpStatements(query, followUpStatements);
    }
  }
}