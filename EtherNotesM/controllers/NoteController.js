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
    return notes.map(note => Note.fromJSON(note));
  }

  async getNoteById(id) {
    await this.db.initialize();
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
    const notes = await this.db.getNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) return null;
    
    const updatedNote = { ...notes[noteIndex], ...updates };
    notes[noteIndex] = updatedNote;
    
    await this.db.saveNote(updatedNote);
    return Note.fromJSON(updatedNote);
  }

  async deleteNote(id) {
    await this.db.initialize();
    const note = await this.getNoteById(id);
    
    if (!note) return false;
    
    await this.db.deleteNote(id);
    return true;
  }

  async searchNotes(query) {
    await this.db.initialize();
    const notes = await this.getAllNotes();
    
    const lowerQuery = query.toLowerCase();
    return notes.filter(note => 
      note.name.toLowerCase().includes(lowerQuery) ||
      note.category.toLowerCase().includes(lowerQuery) ||
      (note.content && note.content.toLowerCase().includes(lowerQuery))
    );
  }
}