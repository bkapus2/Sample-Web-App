export default {
  entityName: 'email',
  collectionName: 'emails',
  tableName: 'UserEmails',
  properties: [
    {
      column: 'email_id',
      key: 'emailId',
      type: 'INTEGER',
    },
    {
      column: 'user_id',
      key: 'userId',
      type: 'INTEGER',
    },
    {
      column: 'email',
      key: 'email',
      type: 'TEXT',
    },
    {
      column: 'is_bad',
      key: 'isBad',
      type: 'BOOLEAN',
    },
  ],
  relations: {
    oneToOne: [],
    oneToMany: [],
    manyToOne: [],
    manyToMany: [],
  }
}