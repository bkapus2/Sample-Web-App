import dbio from './dbio';
import userModel from './models/user'
import emailModel from './models/email'

const { user, users } = dbio.models.add(userModel);
const { email, emails } = dbio.models.add(emailModel);
// can now also access User and users though dbio.User and dbio.users

const logJson = arg => console.log(JSON.stringify(arg, null, '  '))

users
  .select(({ all, password }) => all.except(password))
  .where(({ userId, username }) => userId.isIn(
    emails
      .select(({ userId }) => userId)
      .where(({ email }) => email.matches(/@gmail\.com$/i))
  ))
  .submit()
  .then(console.log);

users
  .update(({ timesLoggedIn }) => timesLoggedIn.increment())
  .where(({ userId }) => userId.is(1))
  .returning(({ timesLoggedIn }) => timesLoggedIn)
  .submit()
  .then(console.log);

users
  .select()
  .where(({userId})=>userId.is(1))
  .submit()
  .then(console.log);