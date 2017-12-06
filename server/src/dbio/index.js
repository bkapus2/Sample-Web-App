import R from 'ramda';
import Collection from './collection';
import Entity from './entity';

const models = [];
models.add = function(model) {
  const {collectionName, entityName, tableName, properties, relationships} = model;
  const keys = R.pluck('key', properties);

  const Mixin = Sup => class extends Sup {
    get properties() {
      return properties
    }
    get keys() {
      return keys;
    }
    get tableName() {
      return tableName;
    }
  }

  const collectionClass = class extends Mixin(Collection) {
    get entity() {
      return entityClass;
    }
  }
  const collectionInstane = new collectionClass;

  const entityClass = class extends Mixin(Entity) {
    get collection() {
      return dbio;
    }
  }

  Object.assign(dbio, {
    [collectionName]: collectionInstane,
    [entityClass]: entityClass,
  })
}

const dbio = {
  models
}

export default dbio;