import R from 'ramda';

const reduceInstance = R.curry(function(keys, instance) {
  return keys.reduce(function(accumulator, key) {
    // should do any type infrencing / conversion here
    accumulator[key] = instance[key];
    return accumulator;
  }, {});
});

class Entity {

  constructor(instance) {
    // Object.assign copies over all properties from 2nd+ arguments to first argument
    Object.assign(this, this.reduceInstance(instance));
  }

  get reduceInstance() {
    return reduceInstance(this.keys);
  }

  get reduceFromDatabase() {
    return reduceFromDatabase(this.properties);
  }

  create() {
    return this.collection.create([this]);
  }

  read() {
    return this.collection.read([this]);
  }

  update() {
    return this.collection.update([this]);
  }

  delete() {
    return this.collection.delete([this]);
  }
}

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

const userProperties = [
  {
    column: 'user_id',
    key: 'userId',
    type: 'INTEGER',
    isPk: true,
  },
  {
    column: 'name',
    key: 'name',
    type: 'TEXT',
  },
  {
    column: 'username',
    key: 'username',
    type: 'TEXT',
  },
];

const pickKey = _ => _.key;
const userKeys = userProperties.map(pickKey);

const userTableName = 'Users';

const UserMixin = Sup => class extends Sup {

  get properties() {
    return userProperties;
  }

  get keys() {
    return userKeys;
  }

  get tableName() {
    return userTableName;
  }
}

class User extends UserMixin(Entity) {

  get collection() {
    return Users;
  }
}

// invoking new here because we only need one instance of our collection
const Users = new class Users extends UserMixin(Collection) {
  
  get entity() {
    return User;
  }
}

console.log(new User({name: 'Brian'}));
console.log(Users.create([{name: 'Brian'}]));
console.log(Users.read({where: {user_id: 1}}));

const is = R.curry((key,val) => ({[key]: {is: val}}));
const isNot = R.curry((key,val) => ({[key]: {isNot: val}}));
const isIn = R.curry((key,val) => ({[key]: {isIn: val}}));
const isNotIn = R.curry((key,val) => ({[key]: {isNotIn: val}}));

const whereTypeCases = {
  TEXT({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
      isIn: isIn(key),
      isNotIn: isNotIn(key),
    }
  },
  INTEGER({key}) {
    return {
      is: is(key),
      isNot: isNot(key),
      isIn: isIn(key),
      isNotIn: isNotIn(key),
    }
  },
  default({type}) {
    throw new Error(`Unsupported type (${type}).`);
  }
}

const or = (...args) => ({or: args});
const and = (...args) => ({and: args});

const where = R.curry(function(properties, cb) {
  const propertyContext = properties.reduce((accumulator, {key, type, column}) => {
    console.log(type, whereTypeCases[type])
    accumulator[key] = (whereTypeCases[type] || whereTypeCases.default)({key, type, column});
    return accumulator;
  },{});

  const comparators = {
    or, and
  }

  const whereDescriptor = cb(comparators, propertyContext);
  console.log(JSON.stringify(whereDescriptor, null, '  '))
});

where(userProperties)(({or}, {userId, username})=>{
  return and(userId.isIn([123,234,345]), username.is('Brian'));
})

// const and = val => ({and: val});
// const where = cb => cb({is, isNot, isIn, isNotIn, and});

// console.log(JSON.stringify(where(function({is, isNot, isIn, isNotIn, and}){
//   return and([
//     {name: is('Brian')},
//     {id: isNotIn([1,2,3])}
//   ])
// })));