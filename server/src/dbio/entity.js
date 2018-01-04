const reduceInstance = function(keys) {
  return function(instance) {
    return keys.reduce(function(accumulator, key) {
      // should do any type infrencing / conversion here
      accumulator[key] = instance[key];
      return accumulator;
    }, {});
  }
};

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

export default Entity;