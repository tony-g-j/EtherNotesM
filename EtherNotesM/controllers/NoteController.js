import { Database } from "../database/DatabaseService"
import { Note } from "../models/note"

export class NoteController {
  constructor() {
    this.db = Database.getInstance()
  }

  async createNote(title, content, vaultId) {
    await this.db.initialize()

    if (!title || !title.trim()) {
      throw new Error("Note title cannot be empty")
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const note = new Note(id, title.trim(), content || "", vaultId)

    console.log("[v0] Note object before saving:", note.toJSON())
    await this.db.saveNote(note.toJSON())
    return note
  }

  async getAllNotes() {
    await this.db.initialize()
    const notes = await this.db.getNotes()
    return notes.map((note) => {
      const { vaultName, userId, ...noteData } = note
      return Note.fromJSON(noteData)
    })
  }

  async getNoteById(id) {
    await this.db.initialize()

    const note = await this.db.getNoteById(id)
    if (!note) return null

    return Note.fromJSON(note)
  }

  async getNotesByVault(vaultId) {
    await this.db.initialize()
    const notes = await this.db.getNotesByVault(vaultId)
    return notes.map((note) => Note.fromJSON(note))
  }

  async updateNote(id, updates) {
    await this.db.initialize()

    const note = await this.db.getNoteById(id)
    if (!note) return null

    await this.db.updateNote(id, updates)

    const updatedNote = await this.db.getNoteById(id)
    return Note.fromJSON(updatedNote)
  }

  async deleteNote(id) {
    await this.db.initialize()

    const note = await this.db.getNoteById(id)
    if (!note) return false

    await this.db.deleteNote(id)
    return true
  }

  async searchNotes(query, vaultId = null) {
    await this.db.initialize()

    const notes = await this.db.searchNotes(query, vaultId)
    return notes.map((note) => Note.fromJSON(note))
  }

  async getNoteCountByVault(vaultId) {
    await this.db.initialize()
    const notes = await this.db.getNotesByVault(vaultId)
    return notes.length
  }
}
