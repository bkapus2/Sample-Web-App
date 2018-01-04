import Collection from './collection';
import Entity from './entity';
import statementBuilder from './../statement-builder';
import pluck from './../util/pluck'

const models = [];
models.add = function(model) {
  const {collectionName, entityName, tableName, properties, relationships} = model;
  const keys = properties.map(pluck('key'));

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
  
  const submitHandler = function(query) {
    console.log(JSON.stringify(query, null, '  '))
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000, query);
    })
  }
  const queryStatements = statementBuilder({properties, submitHandler, collectionName});
  const collectionClass = class extends Mixin(Collection) {
    get entity() {
      return entityClass;
    }    
    get select() {
      return queryStatements.select;
    }  
    get update() {
      return queryStatements.update;
    }
  }
  const collectionInstane = new collectionClass;

  const entityClass = class extends Mixin(Entity) {
    get collection() {
      return collectionInstane;
    }
  }

  const newProperties = {
    [collectionName]: collectionInstane,
    [entityClass]: entityClass,
  }

  Object.assign(dbio, newProperties);

  return newProperties;
}

const dbio = {
  models
}

export default dbio;