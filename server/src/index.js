import User from './user';
import users from './users';

console.log(new User({name: 'Brian'}));
console.log(users.create([{name: 'Brian'}]));
console.log(users.read({where: {user_id: 1}}));

users.where(({and, or}, {userId, username, name}) => and(
  and(
    userId.isIn([2,3,4]),
    userId.isIn([1,2,3]),
  ),
  or(
    username.contains('Mike'),
    username.contains('Brian'),
  ),
));