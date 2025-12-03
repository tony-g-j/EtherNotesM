import { Database } from '../database/Database';
import { Note } from '../models/note';

export class NoteController {
  constructor() {
    this.db = Database.getInstance();
  }

  async createNote(name, category, vaultId, content) {
    await this.db.initialize();
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const note = new Note(id, name, category, vaultId, content);
    
    await this.db.saveNote(note.toJSON());
    return note;
  }

  async getAllNotes() {
    await this.db.initialize();
    const notes = await this.db.getNotes();
    return notes.map(note => {
      const { vaultName, userId, ...noteData } = note;
      return Note.fromJSON(noteData);
    });
  }

  async getNoteById(id) {
    await this.db.initialize();
    
    if (this.db.getNoteById) {
      const note = await this.db.getNoteById(id);
      if (!note) return null;
      
      const { vaultName, userId, ...noteData } = note;
      return Note.fromJSON(noteData);
    }
    
    const notes = await this.db.getNotes();
    const note = notes.find(n => n.id === id);
    return note ? Note.fromJSON(note) : null;
  }

  async getNotesByVault(vaultId) {
    await this.db.initialize();
    const notes = await this.db.getNotesByVault(vaultId);
    return notes.map(note => Note.fromJSON(note));
  }

  async updateNote(id, updates) {
    await this.db.initialize();
    
    let note;
    if (this.db.getNoteById) {
      note = await this.db.getNoteById(id);
    } else {
      
      const notes = await this.db.getNotes();
      note = notes.find(n => n.id === id);
    }
    
    if (!note) return null;
    
    const { vaultName, userId, ...noteData } = note;
    
    const updatedNote = { ...noteData, ...updates };
    
    await this.db.saveNote(updatedNote);
    
    return Note.fromJSON(updatedNote);
  }

  async deleteNote(id) {
    await this.db.initialize();
    
    // Check if note exists
    const note = await this.getNoteById(id);
    if (!note) return false;
    
    await this.db.deleteNote(id);
    return true;
  }

  async searchNotes(query) {
    await this.db.initialize();
    
    if (this.db.searchNotes) {
      const notes = await this.db.searchNotes(query, null);
      return notes.map(note => {
        const { vaultName, userId, ...noteData } = note;
        return Note.fromJSON(noteData);
      });
    }
    
    const notes = await this.getAllNotes();
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.name.toLowerCase().includes(lowerQuery) ||
      note.category.toLowerCase().includes(lowerQuery) ||
      (note.content && note.content.toLowerCase().includes(lowerQuery))
    );
  }

  
  async searchNotesAdvanced(query, vaultId = null, includeContent = true) {
    await this.db.initialize();
    
    const notes = vaultId 
      ? await this.getNotesByVault(vaultId)
      : await this.getAllNotes();
    
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => {
      const matchesName = note.name.toLowerCase().includes(lowerQuery);
      const matchesCategory = note.category.toLowerCase().includes(lowerQuery);
      
      let matchesContent = false;
      if (includeContent && note.content) {
        matchesContent = note.content.toLowerCase().includes(lowerQuery);
      }
      
      return matchesName || matchesCategory || matchesContent;
    });
  }

  async getNotesByCategory(category, vaultId = null) {
    await this.db.initialize();
    
    let notes;
    if (vaultId) {
      notes = await this.getNotesByVault(vaultId);
    } else {
      notes = await this.getAllNotes();
    }
    
    return notes.filter(note => note.category === category);
  }

  async getNotesByTags(tags = [], vaultId = null) {
    await this.db.initialize();
    
    let notes;
    if (vaultId) {
      notes = await this.getNotesByVault(vaultId);
    } else {
      notes = await this.getAllNotes();
    }
    
    return notes.filter(note => {
      const noteTags = note.tags || [];
      return tags.some(tag => noteTags.includes(tag));
    });
  }

  async updateNoteContent(id, content, isEncrypted = false, encryptionKey = null) {
    await this.db.initialize();
    
    const note = await this.getNoteById(id);
    if (!note) return null;
    
    const updates = {
      content,
      isEncrypted,
      encryptionKey,
      updatedAt: new Date().toISOString()
    };
    
    return await this.updateNote(id, updates);
  }

  async getNoteCountByVault(vaultId) {
    await this.db.initialize();
    const notes = await this.getNotesByVault(vaultId);
    return notes.length;
  }
}