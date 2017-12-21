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
    {
      column: 'times_logged_in',
      key: 'timesLoggedIn',
      type: 'INTEGER',
    },
  ],
  relations: {
    oneToOne: [],
    oneToMany: [],
    manyToOne: [],
    manyToMany: [],
  }
}