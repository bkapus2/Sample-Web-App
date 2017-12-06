export default {
  entityName: 'user',
  collectionName: 'users',
  tableName: 'Users',
  properties: [
    {
      column: 'user_id',
      key: 'userId',
      type: 'INTEGER',
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
  ],
  relations: {
    oneToOne: [],
    oneToMany: [],
    manyToOne: [],
    manyToMany: [],
  }
}