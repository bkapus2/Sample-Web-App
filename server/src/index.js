import dbio from './dbio';
import userModel from './models/user'

const { User, users } = dbio.models.add(userModel);
// can now also access User and users though dbio.User and dbio.users

console.log(users.create([{name: 'Brian'}]));
console.log(users.read({where: {user_id: 1}}));

const query = users
  .select(({ all, userId }) => all.except(userId))
  .where(({ username }) => username.contains('Brian'));

console.log(query);
