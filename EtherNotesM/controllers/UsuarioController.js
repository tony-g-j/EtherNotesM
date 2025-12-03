import { Database } from '../database/Database';
import { User } from '../models/usuario';

export class UserController {
  constructor() {
    this.db = Database.getInstance();
  }

  async createUser(nombre, correo, contraseña) {
    await this.db.initialize();
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const user = new User(id, nombre, correo, contraseña);
    
    await this.db.saveUser(user.toJSON());
    return user;
  }

  async getAllUsers() {
    await this.db.initialize();
    const users = await this.db.getUsers();
    return users.map(user => User.fromJSON(user));
  }

  async getUserById(id) {
    await this.db.initialize();
    const user = await this.db.getUserById(id);
    return user ? User.fromJSON(user) : null;
  }

  async updateUser(id, updates) {
    await this.db.initialize();
    const user = await this.db.getUserById(id);
    
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    await this.db.saveUser(updatedUser);
    return User.fromJSON(updatedUser);
  }

  async deleteUser(id) {
    await this.db.initialize();
    const user = await this.db.getUserById(id);
    
    if (!user) return false;
    
    await this.db.deleteUser(id);
    return true;
  }

  async authenticateUser(correo, contraseña) {
    await this.db.initialize();
    const users = await this.db.getUsers();
    const user = users.find(u => u.correo === correo && u.contraseña === contraseña);
    
    return user ? User.fromJSON(user) : null;
  }

  async getUserByEmail(correo) {
    await this.db.initialize();
    const users = await this.db.getUsers();
    const user = users.find(u => u.correo === correo);
    
    return user ? User.fromJSON(user) : null;
  }
}