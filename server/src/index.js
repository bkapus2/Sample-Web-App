import dbio from './dbio';
import userModel from './models/user'

const { User, users } = dbio.models.add(userModel);
// can now also access User and users though dbio.User and dbio.users

console.log(
  users
    .select(({ all, userId }) => all.except(userId))
    .where(({ username }) => username.contains('Brian'))
);

console.log(
  users
    .update(({ name }) => name.set('Brian K.'))
    .where(({ userId }) => userId.is(1))
    // .returning(({ name }) => name)
);