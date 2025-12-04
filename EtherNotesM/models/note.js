export class Note {
  constructor(id, title, content, vaultId, createdAt) {
    this.id = id
    this.title = title
    this.content = content || ""
    this.vaultId = vaultId
    this.createdAt = createdAt || new Date()
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      vaultId: this.vaultId,
      createdAt: this.createdAt,
    }
  }

  static fromJSON(json) {
    return new Note(json.id, json.title, json.content, json.vaultId, new Date(json.createdAt))
  }
}
