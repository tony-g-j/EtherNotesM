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
    
    let user;
    if (this.db.getUserByEmail) {
      user = await this.db.getUserByEmail(correo);
    } else {
      const users = await this.db.getUsers();
      user = users.find(u => u.correo === correo);
    }
    
    if (!user) return null;
    
    const passwordMatches = user.contraseña === contraseña;
    
    return passwordMatches ? User.fromJSON(user) : null;
  }

  async getUserByEmail(correo) {
    await this.db.initialize();
    
    if (this.db.getUserByEmail) {
      const user = await this.db.getUserByEmail(correo);
      return user ? User.fromJSON(user) : null;
    }
    
    const users = await this.db.getUsers();
    const user = users.find(u => u.correo === correo);
    return user ? User.fromJSON(user) : null;
  }

  
  async changePassword(userId, newPassword) {
    await this.db.initialize();
    
    const user = await this.db.getUserById(userId);
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      contraseña: newPassword,
      lastPasswordChange: new Date().toISOString()
    };
    
    await this.db.saveUser(updatedUser);
    return true;
  }

  async updateLastLogin(userId) {
    await this.db.initialize();
    
    const user = await this.db.getUserById(userId);
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    
    await this.db.saveUser(updatedUser);
    return true;
  }

  async getUserStats(userId) {
    await this.db.initialize();
    
    const user = await this.db.getUserById(userId);
    if (!user) return null;
    
    const vaults = await this.db.getVaultsByUser(userId);
    
    const allNotes = await this.db.getNotes();
    const userNotes = allNotes.filter(note => {
      const vault = vaults.find(v => v.id === note.vaultId);
      return vault !== undefined;
    });
    
    return {
      userId,
      nombre: user.nombre,
      correo: user.correo,
      vaultCount: vaults.length,
      noteCount: userNotes.length,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
  }
}