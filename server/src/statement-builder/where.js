import assignstatementChain from './assignStatementChain'

const logicStatement = function(operation){
  return function(property) {
    return function(argument) {
      return {
        property,
        operation,
        argument
      }
    }
  }
};
const is = logicStatement('is');
const isNot = logicStatement('isNot');
const isIn = logicStatement('isIn');
const isNotIn = logicStatement('isNotIn');
const isLessThan = logicStatement('isLessThan');
const isMoreThan = logicStatement('isMoreThan');
const contains = logicStatement('contains');
const matches = logicStatement('matches');
const startsWith = logicStatement('startsWith');
const endsWith = logicStatement('endsWith');

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

const keyValueMap = {
  TEXT({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
      isIn: isIn(key),
      isNotIn: isNotIn(key),
      contains: contains(key),
      startsWith: startsWith(key),
      endsWith: endsWith(key),
      matches: matches(key),
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
  BOOLEAN({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
    }
  },
  default({type}) {
    throw new Error(`Unsupported type (${type}).`);
  }
}

export default function(properties) {
  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    accumulator[key] = (keyValueMap[type] || keyValueMap.default)({key, type, column});
    return accumulator;
  },{});

  const operators = {
    and, or, not
  }

  return function where({ query, statementChain }) {
    const indexOfStatement = statementChain.findIndex( statement => statement.name === 'where');
    statementChain = statementChain.slice(indexOfStatement+1);
    return function(callback) {
      const value = callback(propertyContext, operators);

      // check that the callback returned a value
      if (typeof value !== 'object') {
        throw new TypeError('where statement callback did not provide a return value.')
      }

      const _query = Object.assign({}, query, {
        where: value
      });
      
      return assignstatementChain(_query, statementChain);
    }  
  }
};