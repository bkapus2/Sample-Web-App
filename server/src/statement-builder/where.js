import R from 'ramda';
import assignFollowUpStatements from './assignFollowUpStatements'

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

const keyValueMap = {
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

export default function(properties) {
  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    accumulator[key] = (keyValueMap[type] || keyValueMap.default)({key, type, column});
    return accumulator;
  },{});

  const operators = {
    and, or, not
  }

  return function where({ query, followUpStatements }) {
    const indexOfStatement = followUpStatements.findIndex( statement => statement.name === 'where');
    followUpStatements = followUpStatements.slice(indexOfStatement+1);
    return function(callback) {
      const _query = Object.assign({}, query, {
        where: callback(propertyContext, operators)
      });
      return assignFollowUpStatements(_query, followUpStatements);
    }  
  }
};