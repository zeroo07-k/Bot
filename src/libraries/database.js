import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../database.json')

export class Database {
    constructor() {
        this.data = {
            users: {},
            chats: {},
            stats: {},
            settings: {}
        }
    }

    async read() {
        try {
            const data = await fs.readFile(dbPath, 'utf-8')
            this.data = JSON.parse(data)
            return this.data
        } catch (e) {
            await this.write()
            return this.data
        }
    }

    async write() {
        try {
            await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2))
            return true
        } catch (e) {
            console.error('Database write error:', e)
            return false
        }
    }
}

export default new Database()
