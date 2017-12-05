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

export default UserMixin;