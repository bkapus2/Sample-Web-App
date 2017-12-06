import R from 'ramda';

const logicStatement = R.curry(function(operation, property, argument){
  return {
    property,
    operation,
    argument
  }
});
const is = logicStatement('is');
const isNot = logicStatement('isNot');
const isIn = logicStatement('isIn');
const isNotIn = logicStatement('isNotIn');
const isLessThan = logicStatement('isLessThan');
const isMoreThan = logicStatement('isMoreThan');
const contains = logicStatement('contains');

const operator = function(operation) {
  return function(...args) {
    return {
      operation,
      argument: args
    }
  }
}
const or = operator('or');
const and = operator('and');
const not = operator('not');

const whereTypeCases = {
  TEXT({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
      isIn: isIn(key),
      isNotIn: isNotIn(key),
      contains: contains(key),
    }
  },
  INTEGER({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
      isIn: isIn(key),
      isNotIn: isNotIn(key),
      isLessThan: isLessThan(key),
      isMoreThan: isMoreThan(key),
    }
  },
  default({type}) {
    throw new Error(`Unsupported type (${type}).`);
  }
}

const where = function(properties) {
  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    accumulator[key] = (whereTypeCases[type] || whereTypeCases.default)({key, type, column});
    return accumulator;
  },{});

  const operators = {
    and, or, not
  }

  return function(query) {
    return function(callback) {
      return Object.assign({}, query, {
        where: callback(propertyContext, operators)
      });
    }  
  }
};

export default where;