import * as SQLite from 'expo-sqlite';

export class Database {
  static instance = null;
  initialized = false;
  db = null;

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
      // Opens database
      this.db = await SQLite.openDatabaseAsync('securenotes.db');
      
      // Create tables
      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          masterPasswordHash TEXT NOT NULL,
          salt TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          lastLogin DATETIME
        );
        
        CREATE TABLE IF NOT EXISTS vaults (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          isLocked BOOLEAN DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          vaultId TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          isEncrypted BOOLEAN DEFAULT 1,
          encryptionKey TEXT,
          tags TEXT, -- JSON array of tags
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vaultId) REFERENCES vaults(id) ON DELETE CASCADE
        );
        
        CREATE INDEX IF NOT EXISTS idx_vaults_userId ON vaults(userId);
        CREATE INDEX IF NOT EXISTS idx_notes_vaultId ON notes(vaultId);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);

      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // User methods
  async saveUser(user) {
    await this.initialize();
    
    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO users (id, email, name, masterPasswordHash, salt, lastLogin) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.name || null, user.masterPasswordHash, 
       user.salt, user.lastLogin || new Date().toISOString()]
    );
    
    return result.lastInsertRowId;
  }

  async getUsers() {
    await this.initialize();
    
    return await this.db.getAllAsync(
      `SELECT * FROM users ORDER BY createdAt DESC`
    );
  }

  async getUserById(id) {
    await this.initialize();
    
    return await this.db.getFirstAsync(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
  }

  async getUserByEmail(email) {
    await this.initialize();
    
    return await this.db.getFirstAsync(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
  }

  async deleteUser(id) {
    await this.initialize();
    
    await this.db.runAsync(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
  }

  // Vault methods
  async saveVault(vault) {
    await this.initialize();
    
    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO vaults (id, userId, name, description, isLocked, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [vault.id, vault.userId, vault.name, vault.description || null, 
       vault.isLocked ? 1 : 0, vault.createdAt || new Date().toISOString()]
    );
    
    return result.lastInsertRowId;
  }

  async getVaults() {
    await this.initialize();
    
    return await this.db.getAllAsync(
      `SELECT v.*, u.email as userEmail, u.name as userName 
       FROM vaults v 
       LEFT JOIN users u ON v.userId = u.id 
       ORDER BY v.createdAt DESC`
    );
  }

  async getVaultById(id) {
    await this.initialize();
    
    return await this.db.getFirstAsync(
      `SELECT v.*, u.email as userEmail, u.name as userName 
       FROM vaults v 
       LEFT JOIN users u ON v.userId = u.id 
       WHERE v.id = ?`,
      [id]
    );
  }

  async getVaultsByUser(userId) {
    await this.initialize();
    
    return await this.db.getAllAsync(
      `SELECT * FROM vaults WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
  }

  async deleteVault(id) {
    await this.initialize();
    
    await this.db.runAsync(
      `DELETE FROM vaults WHERE id = ?`,
      [id]
    );
  }

  // Note methods
  async saveNote(note) {
    await this.initialize();
    
    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO notes 
       (id, vaultId, title, content, isEncrypted, encryptionKey, tags, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [note.id, note.vaultId, note.title, note.content || null, 
       note.isEncrypted ? 1 : 0, note.encryptionKey || null,
       note.tags ? JSON.stringify(note.tags) : null,
       note.createdAt || now, now]
    );
    
    return result.lastInsertRowId;
  }

  async getNotes() {
    await this.initialize();
    
    const notes = await this.db.getAllAsync(
      `SELECT n.*, v.name as vaultName, v.userId 
       FROM notes n 
       LEFT JOIN vaults v ON n.vaultId = v.id 
       ORDER BY n.updatedAt DESC`
    );
    
    // Parse tags JSON
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      isEncrypted: Boolean(note.isEncrypted)
    }));
  }

  async getNoteById(id) {
    await this.initialize();
    
    const note = await this.db.getFirstAsync(
      `SELECT n.*, v.name as vaultName, v.userId 
       FROM notes n 
       LEFT JOIN vaults v ON n.vaultId = v.id 
       WHERE n.id = ?`,
      [id]
    );
    
    if (note) {
      note.tags = note.tags ? JSON.parse(note.tags) : [];
      note.isEncrypted = Boolean(note.isEncrypted);
    }
    
    return note;
  }

  async getNotesByVault(vaultId) {
    await this.initialize();
    
    const notes = await this.db.getAllAsync(
      `SELECT * FROM notes WHERE vaultId = ? ORDER BY updatedAt DESC`,
      [vaultId]
    );
    
    // Parse tags JSON
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      isEncrypted: Boolean(note.isEncrypted)
    }));
  }

  async searchNotes(query, userId = null) {
    await this.initialize();
    
    let sql = `SELECT n.*, v.name as vaultName, v.userId 
               FROM notes n 
               LEFT JOIN vaults v ON n.vaultId = v.id 
               WHERE (n.title LIKE ? OR n.content LIKE ?)`;
    let params = [`%${query}%`, `%${query}%`];
    
    if (userId) {
      sql += ` AND v.userId = ?`;
      params.push(userId);
    }
    
    sql += ` ORDER BY n.updatedAt DESC`;
    
    const notes = await this.db.getAllAsync(sql, params);
    
    // Parse tags JSON
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      isEncrypted: Boolean(note.isEncrypted)
    }));
  }

  async getNotesByTag(tag, userId = null) {
    await this.initialize();
    
    let sql = `SELECT n.*, v.name as vaultName, v.userId 
               FROM notes n 
               LEFT JOIN vaults v ON n.vaultId = v.id 
               WHERE n.tags LIKE ?`;
    let params = [`%${tag}%`];
    
    if (userId) {
      sql += ` AND v.userId = ?`;
      params.push(userId);
    }
    
    sql += ` ORDER BY n.updatedAt DESC`;
    
    const notes = await this.db.getAllAsync(sql, params);
    
    // Parse tags JSON
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      isEncrypted: Boolean(note.isEncrypted)
    }));
  }

  async deleteNote(id) {
    await this.initialize();
    
    await this.db.runAsync(
      `DELETE FROM notes WHERE id = ?`,
      [id]
    );
  }

  async clearAll() {
    await this.initialize();
    
    await this.db.execAsync(`
      DELETE FROM notes;
      DELETE FROM vaults;
      DELETE FROM users;
    `);
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.initialized = false;
      this.db = null;
    }
  }

  // Transaction support
  async transaction(callback) {
    await this.initialize();
    
    return await this.db.withTransactionAsync(async () => {
      return await callback();
    });
  }

  // Backup and restore methods
  async exportDatabase() {
    await this.initialize();
    
    const users = await this.getUsers();
    const vaults = await this.getVaults();
    const notes = await this.getNotes();
    
    return {
      users,
      vaults,
      notes,
      exportedAt: new Date().toISOString()
    };
  }

  async importDatabase(data) {
    await this.initialize();
    
    return await this.transaction(async () => {
      // Clear existing data
      await this.clearAll();
      
      // Import users
      for (const user of data.users) {
        await this.saveUser(user);
      }
      
      // Import vaults
      for (const vault of data.vaults) {
        await this.saveVault(vault);
      }
      
      // Import notes
      for (const note of data.notes) {
        await this.saveNote(note);
      }
    });
  }
}