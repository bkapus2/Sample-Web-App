import dbio from './dbio';
import userModel from './models/user'

const { User, users } = dbio.models.add(userModel);
// can now also access User and users though dbio.User and dbio.users

const query = users
  .select(({ all, userId }) => all.except(userId))
  .where(({ username }) => username.contains('Brian'));

console.log(query);

console.log(users.update(({name})=> userId.set('Brian K.')))