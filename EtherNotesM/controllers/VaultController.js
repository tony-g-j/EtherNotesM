import { Database } from '../database/Database';
import { Vault } from '../models/vault';

export class VaultController {
  constructor() {
    this.db = Database.getInstance();
  }

  async createVault(name, category, userId) {
    await this.db.initialize();
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const vault = new Vault(id, name, category, userId);
    
    await this.db.saveVault(vault.toJSON());
    return vault;
  }

  async getAllVaults() {
    await this.db.initialize();
    const vaults = await this.db.getVaults();
    return vaults.map(vault => Vault.fromJSON(vault));
  }

  async getVaultById(id) {
    await this.db.initialize();
    const vaults = await this.db.getVaults();
    const vault = vaults.find(v => v.id === id);
    
    return vault ? Vault.fromJSON(vault) : null;
  }

  async getVaultsByUser(userId) {
    await this.db.initialize();
    const vaults = await this.db.getVaultsByUser(userId);
    return vaults.map(vault => Vault.fromJSON(vault));
  }

  async updateVault(id, updates) {
    await this.db.initialize();
    const vaults = await this.db.getVaults();
    const vaultIndex = vaults.findIndex(v => v.id === id);
    
    if (vaultIndex === -1) return null;
    
    const updatedVault = { ...vaults[vaultIndex], ...updates };
    vaults[vaultIndex] = updatedVault;
    
    await this.db.saveVault(updatedVault);
    return Vault.fromJSON(updatedVault);
  }

  async deleteVault(id) {
    await this.db.initialize();
    const vault = await this.getVaultById(id);
    
    if (!vault) return false;
    
    await this.db.deleteVault(id);
    return true;
  }
}