export class Note {
  constructor(id, name, category, vaultId, content, date) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.vaultId = vaultId;
    this.content = content || '';
    this.date = date || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      category: this.category,
      vaultId: this.vaultId,
      content: this.content,
    };
  }

  static fromJSON(json) {
    return new Note(
      json.id,
      json.name,
      json.category,
      json.vaultId,
      json.content,
      new Date(json.date)
    );
  }
}