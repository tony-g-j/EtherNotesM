import * as SQLite from "expo-sqlite"

export class Database {
  static instance = null
  initialized = false
  db = null

  constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async initialize() {
    if (this.initialized) return

    try {
      this.db = await SQLite.openDatabaseAsync("ethernotesm.db")

      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON; 
        
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          isActive INTEGER DEFAULT 1
        );
        
        CREATE TABLE IF NOT EXISTS vaults (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT DEFAULT 'folder', 
          color TEXT DEFAULT '#ffffff',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          vaultId TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vaultId) REFERENCES vaults(id) ON DELETE CASCADE
        );
      `)

      this.initialized = true
      console.log("Database initialized successfully")
    } catch (error) {
      console.error("Database initialization failed:", error)
      throw error
    }
  }

  // User methods
  async saveUser(user) {
    await this.initialize()

    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO users (id, email, name, password) 
       VALUES (?, ?, ?, ?)`,
      [user.id, user.correo, user.nombre, user.contraseña],
    )

    return result.lastInsertRowId
  }

  async getUsers() {
    await this.initialize()

    return await this.db.getAllAsync(`SELECT * FROM users ORDER BY createdAt DESC`)
  }

  async getUserById(id) {
    await this.initialize()

    return await this.db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [id])
  }

  async getUserByEmail(email) {
    await this.initialize()

    return await this.db.getFirstAsync(`SELECT * FROM users WHERE email = ?`, [email])
  }

  async deleteUser(id) {
    await this.initialize()

    await this.db.runAsync(`DELETE FROM users WHERE id = ?`, [id])
  }

  // User update methods
  async updateUser(id, updates) {
    await this.initialize()
    const { name, email, password } = updates
    const result = await this.db.runAsync(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [
      name || null,
      email || null,
      password || null,
      id,
    ])
    return result
  }

  async getUserStats(userId) {
    await this.initialize()
    const vaultResult = await this.db.getAllAsync(`SELECT COUNT(*) as count FROM vaults WHERE userId = ?`, [userId])
    const noteResult = await this.db.getAllAsync(
      `SELECT COUNT(*) as count FROM notes WHERE vaultId IN (SELECT id FROM vaults WHERE userId = ?)`,
      [userId],
    )
    return {
      totalVaults: vaultResult?.[0]?.count || 0,
      totalNotes: noteResult?.[0]?.count || 0,
    }
  }

  async updateUserEmail(userId, newEmail) {
    await this.initialize()
    const result = await this.db.runAsync(`UPDATE users SET email = ? WHERE id = ?`, [newEmail, userId])
    return result
  }

  async updateUserPassword(userId, newPassword) {
    await this.initialize()
    const result = await this.db.runAsync(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, userId])
    return result
  }

  async deleteAllNotesByUser(userId) {
    await this.initialize()
    const result = await this.db.runAsync(
      `DELETE FROM notes WHERE vaultId IN (SELECT id FROM vaults WHERE userId = ?)`,
      [userId],
    )
    return result
  }

  async deactivateAccount(userId) {
    await this.initialize()
    const result = await this.db.runAsync(`UPDATE users SET isActive = 0 WHERE id = ?`, [userId])
    return result
  }

  // Vault methods
  async saveVault(vault) {
    await this.initialize()

    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO vaults (id, userId, name, description, createdAt) 
       VALUES (?, ?, ?, ?, ?)`,
      [vault.id, vault.userId, vault.name, vault.description || null, vault.createdAt || new Date().toISOString()],
    )

    return result.lastInsertRowId
  }

  async getVaults() {
    await this.initialize()

    return await this.db.getAllAsync(
      `SELECT v.*, u.email as userEmail, u.name as userName 
       FROM vaults v 
       LEFT JOIN users u ON v.userId = u.id 
       ORDER BY v.createdAt DESC`,
    )
  }

  async getVaultsByUser(userId) {
    await this.initialize()

    return await this.db.getAllAsync(`SELECT * FROM vaults WHERE userId = ? ORDER BY createdAt DESC`, [userId])
  }

  async deleteVault(id) {
    await this.initialize()

    await this.db.runAsync(`DELETE FROM vaults WHERE id = ?`, [id])
  }

  async getVaultById(id) {
    await this.initialize()
    return await this.db.getFirstAsync(`SELECT * FROM vaults WHERE id = ?`, [id])
  }

  async updateVault(id, updates) {
    await this.initialize()
    const { name, description } = updates
    await this.db.runAsync(`UPDATE vaults SET name = ?, description = ? WHERE id = ?`, [name, description, id])
  }

  // Note methods
  async saveNote(note) {
    await this.initialize()

    if (!note || !note.title) {
      console.error("[v0] Invalid note object:", note)
      throw new Error("Note title is required")
    }

    const now = new Date().toISOString()
    console.log("[v0] Saving note to DB:", { id: note.id, title: note.title, vaultId: note.vaultId })

    const result = await this.db.runAsync(
      `INSERT INTO notes 
       (id, vaultId, title, content, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [note.id, note.vaultId, note.title, note.content || "", note.createdAt || now, now],
    )

    console.log("[v0] Note saved successfully with ID:", result.lastInsertRowId)
    return result.lastInsertRowId
  }

  async getNotes() {
    await this.initialize()

    return await this.db.getAllAsync(
      `SELECT n.*, v.name as vaultName, v.userId 
       FROM notes n 
       LEFT JOIN vaults v ON n.vaultId = v.id 
       ORDER BY n.updatedAt DESC`,
    )
  }

  async getNotesByVault(vaultId) {
    await this.initialize()

    return await this.db.getAllAsync(`SELECT * FROM notes WHERE vaultId = ? ORDER BY updatedAt DESC`, [vaultId])
  }

  async deleteNote(id) {
    await this.initialize()

    await this.db.runAsync(`DELETE FROM notes WHERE id = ?`, [id])
  }

  async getNoteById(id) {
    await this.initialize()
    return await this.db.getFirstAsync(`SELECT * FROM notes WHERE id = ?`, [id])
  }

  async updateNote(id, updates) {
    await this.initialize()
    const { title, content } = updates
    const now = new Date().toISOString()
    await this.db.runAsync(`UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?`, [
      title,
      content,
      now,
      id,
    ])
  }

  async searchNotes(query, vaultId = null) {
    await this.initialize()
    const searchTerm = `%${query}%`
    if (vaultId) {
      return await this.db.getAllAsync(
        `SELECT * FROM notes WHERE (title LIKE ? OR content LIKE ?) AND vaultId = ? ORDER BY updatedAt DESC`,
        [searchTerm, searchTerm, vaultId],
      )
    }
    return await this.db.getAllAsync(
      `SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updatedAt DESC`,
      [searchTerm, searchTerm],
    )
  }

  async clearAll() {
    await this.initialize()

    await this.db.execAsync(`
      DELETE FROM notes;
      DELETE FROM vaults;
      DELETE FROM users;
    `)
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync()
      this.initialized = false
      this.db = null
    }
  }
}
