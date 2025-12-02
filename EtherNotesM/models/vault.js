export class Vault {
  constructor(id, name, category, userId, date) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.userId = userId;
    this.date = date || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      category: this.category,
      userId: this.userId,
    };
  }

  static fromJSON(json) {
    return new Vault(
      json.id,
      json.name,
      json.category,
      json.userId,
      new Date(json.date)
    );
  }
}