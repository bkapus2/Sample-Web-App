import dbio from './dbio';
import userModel from './models/user'

const { User, users } = dbio.models.add(userModel);
// can now also access User and users though dbio.User and dbio.users

const logJson = arg => console.log(JSON.stringify(arg, null, '  '))

logJson(
  users
    .select(({ all, userId }) => all.except(userId))
    .where(({ username }) => username.contains('Brian'))
);

logJson(
  users
    .update(({ timesLoggedIn }) => timesLoggedIn.increment())
    .where(({ userId }) => userId.is(1))
    .returning(({ timesLoggedIn }) => timesLoggedIn)
);

const queryBase = users
  .update(({ name }) => name.set('Brian K.'))
  .where(({ userId }) => userId.is(1));

logJson(queryBase.returning(({ name }) => name))
logJson(queryBase.returning(({ all }) => all))

