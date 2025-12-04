import { Database } from "../database/DatabaseService"
import { Vault } from "../models/vault"

export class VaultController {
  constructor() {
    this.db = Database.getInstance()
  }

  async createVault(name, category, userId, description = "") {
    await this.db.initialize()

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const vault = new Vault(id, name, category, userId, description)

    await this.db.saveVault(vault.toJSON())
    return vault
  }

  async getAllVaults() {
    await this.db.initialize()
    const vaults = await this.db.getVaults()
    return vaults.map((vault) => {
      const { userEmail, userName, ...vaultData } = vault
      return Vault.fromJSON(vaultData)
    })
  }

  async getVaultById(id) {
    await this.db.initialize()
    const vault = await this.db.getVaultById(id)

    if (!vault) return null
    return Vault.fromJSON(vault)
  }

  async getVaultsByUser(userId) {
    await this.db.initialize()
    const vaults = await this.db.getVaultsByUser(userId)
    return vaults.map((vault) => Vault.fromJSON(vault))
  }

  async updateVault(id, updates) {
    await this.db.initialize()

    const existingVault = await this.db.getVaultById(id)
    if (!existingVault) return null

    await this.db.updateVault(id, updates)

    const updatedVault = await this.db.getVaultById(id)
    return Vault.fromJSON(updatedVault)
  }

  async deleteVault(id) {
    await this.db.initialize()

    const vault = await this.db.getVaultById(id)
    if (!vault) return false

    await this.db.deleteVault(id)
    return true
  }

  async searchVaultsByName(searchTerm, userId = null) {
    await this.db.initialize()

    const vaults = await this.db.getVaults()

    const filteredVaults = vaults.filter((vault) => {
      const matchesName = vault.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesUser = userId ? vault.userId === userId : true
      return matchesName && matchesUser
    })

    return filteredVaults.map((vault) => Vault.fromJSON(vault))
  }

  async getVaultsWithStats(userId = null) {
    await this.db.initialize()

    const vaults = await this.db.getVaults()
    const notes = await this.db.getNotes()

    const filteredVaults = userId ? vaults.filter((v) => v.userId === userId) : vaults

    return filteredVaults.map((vault) => {
      const vaultNotes = notes.filter((note) => note.vaultId === vault.id)
      return {
        ...Vault.fromJSON(vault),
        noteCount: vaultNotes.length,
      }
    })
  }
}
