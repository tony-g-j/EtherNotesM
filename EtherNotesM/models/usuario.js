export class User {
  constructor(id, nombre, correo, contraseña, fechaCreacion) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.contraseña = contraseña;
    this.fechaCreacion = fechaCreacion || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      fechaCreacion: this.fechaCreacion,
      correo: this.correo,
      contraseña: this.contraseña,
    };
  }

  static fromJSON(json) {
    return new User(
      json.id,
      json.nombre,
      json.correo,
      json.contraseña,
      new Date(json.fechaCreacion)
    );
  }
}