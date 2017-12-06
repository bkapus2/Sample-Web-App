import R from 'ramda';
import statementBuilder from './../statement-builder';

const isUndefined = val => val === undefined;
const isNull = val => val === null;
const isString = val => typeof val === 'string';
const isNumber = val => typeof val === 'number';
const isInteger = val => Number.isInteger(val);
const isArray = val => Array.isArray(val);
const hasLength = val => Boolean(val.length);

// can be called arrayContainsOnly(Object, [{}]) or arrayContainsOnly(Object)([{}])
const arrayContainsOnly = R.curry(function(type,arr){
  return R.all(R.is(type), arr)
});

const validateIsArrayOfObjects = function(arr) {
  if (!isArray(arr) || !arrayContainsOnly(Object, arr)) {
    throw new Error("value must be an array of objects");
  }
}

const wrapString = function(wrapWith) {
  return function(str) {
    return wrapWith + str + wrapWith;
  }
}

const wrapWithSingleQuote = wrapString("'");

const reduceToRow = function(properties, {replaceUndefined}={}) {
  return function(instance) {
    return properties.reduce(function(accumulator, { column, key, type }) {
      let value = instance[key];
      // type specific checks
      if (isString(value)) {
        value = wrapWithSingleQuote(value);
      }
      // undefined, null checks
      if (isUndefined(value) && !isUndefined(replaceUndefined)) {
        value = replaceUndefined;
      } else if (isNull(value)) {
        value = 'NULL';
      }
      accumulator[column] = value;
      return accumulator;
    }, {});
  }
}

const parseWhereObject = function(where) {
  return JSON.stringify(where);
}

class Collection {
  create(instances) {
    return new Promise((resolve, reject) => {
      validateIsArrayOfObjects(instances);
      const entities = instances.map(this.instanciate);
      const createStatement = this.createStatement(entities);
      resolve(createStatement);
    });
  }

  read({where}={}) {
    return new Promise((resolve, reject) => {
      const whereSubStatement = where ? this.whereSubStatement(where) : null;
      resolve({whereSubStatement})
    });
  }

  update() {
    return new Promise((resolve, reject) => {

    });
  }

  delete() {
    return new Promise((resolve, reject) => {

    });
  }

  get where() {
    return statementBuilder.where(this.properties);
  }

  get instanciate() {
    return instance => new this.entity(instance)
  }

  createStatement(entities) {
    const rows = entities.map(reduceToRow(this.properties, {replaceUndefined: 'DEFAULT'}));
    const keys = Object.keys(rows[0]).join(',');
    const values = rows.map(row=>'('+Object.values(row).join(',')+')').join(',');
    const returning = this.properties.map(property=>property.column).join(',');
    return `INSERT INTO ${this.tableName} (${keys}) VALUES ${values} RETURNING ${returning};`
  }

  whereSubStatement(where) {
    return parseWhereObject(where);
  }
}

export default Collection;