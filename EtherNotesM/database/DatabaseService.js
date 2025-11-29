import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        this.storageKey = 'usuarios';
    }

    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage para web');
        } else {
            console.log('Usando SQLite para móvil');
            this.db = await SQLite.openDatabaseAsync('miapp.db');
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    async getAll() {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } else {
            return await this.db.getAllAsync('SELECT * FROM usuarios ORDER BY id DESC');
        }
    }

    async add(nombre) {
        if (Platform.OS === 'web') {
            const usuarios = await this.getAll();

            const nuevoUsuario = {
                id: Date.now(),
                nombre,
                fecha_creacion: new Date().toISOString()
            };

            usuarios.unshift(nuevoUsuario);
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return nuevoUsuario;

        } else {
            const result = await this.db.runAsync(
                'INSERT INTO usuarios (nombre) VALUES(?)',
                nombre
            );
            return {
                id: result.lastInsertRowId,
                nombre,
                fecha_creacion: new Date().toISOString()
            };
        }
    }

    async update(id, nuevoNombre) {
        if (Platform.OS === 'web') {
            const usuarios = await this.getAll();
            const index = usuarios.findIndex(u => u.id === id);

            if (index === -1) return null;

            usuarios[index].nombre = nuevoNombre;

            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

            return usuarios[index];

        } else {
            await this.db.runAsync(
                'UPDATE usuarios SET nombre = ? WHERE id = ?',
                [nuevoNombre, id]
            );

            const result = await this.db.getFirstAsync(
                'SELECT * FROM usuarios WHERE id = ?',
                id
            );

            return result;
        }
    }

    async remove(id) {
        if (Platform.OS === 'web') {
            const usuarios = await this.getAll();
            const nuevos = usuarios.filter(u => u.id !== id);

            localStorage.setItem(this.storageKey, JSON.stringify(nuevos));

            return true;

        } else {
            await this.db.runAsync(
                'DELETE FROM usuarios WHERE id = ?',
                id
            );

            return true;
        }
    }
}

export default new DatabaseService();