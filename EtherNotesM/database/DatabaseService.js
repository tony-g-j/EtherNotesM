import AsyncStorage from '@react-native-async-storage/async-storage';

export class Database {
  static instance = null;
  initialized = false;

  // Storage keys
  USERS_KEY = '@users';
  VAULTS_KEY = '@vaults';
  NOTES_KEY = '@notes';

  constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize with empty arrays if not exists
      const users = await AsyncStorage.getItem(this.USERS_KEY);
      if (!users) await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify([]));

      const vaults = await AsyncStorage.getItem(this.VAULTS_KEY);
      if (!vaults) await AsyncStorage.setItem(this.VAULTS_KEY, JSON.stringify([]));

      const notes = await AsyncStorage.getItem(this.NOTES_KEY);
      if (!notes) await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify([]));

      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // User methods
  async saveUser(user) {
    const users = await this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  async getUsers() {
    const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async deleteUser(id) {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
  }

  // Vault methods
  async saveVault(vault) {
    const vaults = await this.getVaults();
    const existingIndex = vaults.findIndex(v => v.id === vault.id);
    
    if (existingIndex >= 0) {
      vaults[existingIndex] = vault;
    } else {
      vaults.push(vault);
    }
    
    await AsyncStorage.setItem(this.VAULTS_KEY, JSON.stringify(vaults));
  }

  async getVaults() {
    const vaultsJson = await AsyncStorage.getItem(this.VAULTS_KEY);
    return vaultsJson ? JSON.parse(vaultsJson) : [];
  }

  async getVaultsByUser(userId) {
    const vaults = await this.getVaults();
    return vaults.filter(vault => vault.userId === userId);
  }

  async deleteVault(id) {
    const vaults = await this.getVaults();
    const filteredVaults = vaults.filter(vault => vault.id !== id);
    await AsyncStorage.setItem(this.VAULTS_KEY, JSON.stringify(filteredVaults));
  }

  // Note methods
  async saveNote(note) {
    const notes = await this.getNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    
    await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  async getNotes() {
    const notesJson = await AsyncStorage.getItem(this.NOTES_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  }

  async getNotesByVault(vaultId) {
    const notes = await this.getNotes();
    return notes.filter(note => note.vaultId === vaultId);
  }

  async deleteNote(id) {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(filteredNotes));
  }

  async clearAll() {
    await AsyncStorage.multiRemove([this.USERS_KEY, this.VAULTS_KEY, this.NOTES_KEY]);
    await this.initialize();
  }
}