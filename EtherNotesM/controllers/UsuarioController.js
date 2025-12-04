import { Database } from "../database/DatabaseService"
import { User } from "../models/usuario"

export default class UsuarioController {
  constructor() {
    this.db = Database.getInstance()
  }

  async createUser(nombre, correo, contraseña) {
    try {
      await this.db.initialize()

      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const user = new User(id, nombre, correo, contraseña)

      await this.db.saveUser(user)
      return { success: true, user, message: "Usuario creado exitosamente" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async authenticateUser(correo, contraseña) {
    try {
      await this.db.initialize()

      const userData = await this.db.getUserByEmail(correo)

      if (!userData) {
        return { success: false, message: "Usuario no encontrado" }
      }

      if (userData.password !== contraseña) {
        return { success: false, message: "Contraseña incorrecta" }
      }

      const user = new User(userData.id, userData.name, userData.email, userData.password)

      return { success: true, user, message: "Login exitoso" }
    } catch (error) {
      return { success: false, message: "Error en autenticación: " + error.message }
    }
  }

  async getUserById(id) {
    try {
      await this.db.initialize()
      const userData = await this.db.getUserById(id)

      if (!userData) return null

      return new User(userData.id, userData.name, userData.email, userData.password)
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      return null
    }
  }

  async getAllUsers() {
    try {
      await this.db.initialize()
      const users = await this.db.getUsers()
      return users.map((u) => new User(u.id, u.name, u.email, u.password))
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      return []
    }
  }

  async deleteUser(id) {
    try {
      await this.db.initialize()
      await this.db.deleteUser(id)
      return { success: true, message: "Usuario eliminado" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async updateUserEmail(id, newEmail) {
    try {
      await this.db.initialize()
      await this.db.updateUserEmail(id, newEmail)
      return { success: true, message: "Correo actualizado exitosamente" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async updateUserPassword(id, newPassword) {
    try {
      await this.db.initialize()
      await this.db.updateUserPassword(id, newPassword)
      return { success: true, message: "Contraseña actualizada exitosamente" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async getUserStats(userId) {
    try {
      await this.db.initialize()
      const stats = await this.db.getUserStats(userId)
      return stats
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      return { totalVaults: 0, totalNotes: 0 }
    }
  }

  async deleteAllNotes(userId) {
    try {
      await this.db.initialize()
      await this.db.deleteAllNotesByUser(userId)
      return { success: true, message: "Todas las notas han sido eliminadas" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async deactivateAccount(id) {
    try {
      await this.db.initialize()
      await this.db.deactivateAccount(id)
      return { success: true, message: "Cuenta desactivada" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}
