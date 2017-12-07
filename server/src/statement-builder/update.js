const logicStatement = function(operation){
  return function(property) {
    return function(argument) {
      return {
        operation,
        property,
        argument
      }
    }
  }
};
const set = logicStatement('set');

const keyValueMap = {
  TEXT({key}) {
    return {
      set: set(key),
    }
  },
  INTEGER({key}) {
    return {
      set: set(key),
    }
  },
  default({type}) {
    throw new Error(`Unsupported type (${type}).`);
  }
}

export default function(properties) {
  const propertyContext = properties.reduce((accumulator, {key, column, type}) => {
    accumulator[key] = (keyValueMap[type] || keyValueMap.default)({key, column, type});
  }, {});

  return function(callback) {
    return { update: callback(propertyContext) }
  }
}