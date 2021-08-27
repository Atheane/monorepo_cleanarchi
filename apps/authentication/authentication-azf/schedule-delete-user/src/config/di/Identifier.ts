export class Identifier {
  static config = Symbol.for('config');
  static userRepository = Symbol.for('userRepository');
  static getUsers = Symbol.for('getUsers');
  static deleteUsers = Symbol.for('deleteUsers');
}
