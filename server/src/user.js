import Entity from './entity';
import UserMixin from './user-mixin';
import users from './users';

class User extends UserMixin(Entity) {
  get collection() {
    return users;
  }
}

export default User;
