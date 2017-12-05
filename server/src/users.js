import Collection from './collection';
import UserMixin from './user-mixin';
import User from './user';

// invoking new here because we only need one instance of our collection
const Users = class Users extends UserMixin(Collection) {
  get entity() {
    return User;
  }
}

export default new Users();