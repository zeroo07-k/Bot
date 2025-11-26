import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../database.json')

export class Store {
    constructor() {
        this.data = {
            users: {},
            chats: {},
            stats: {},
            settings: {}
        }
        // Mystic Bot compatibility
        global.db = { data: this.data }
    }

    async load() {
        try {
            const data = await fs.readFile(dbPath, 'utf-8')
            this.data = JSON.parse(data)
            global.db.data = this.data // Sync global
            console.log('✓ Database loaded')
        } catch (e) {
            console.log('Creating new database...')
            await this.save()
        }
    }

    async save() {
        try {
            // Sync before save
            this.data = global.db.data
            await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2))
        } catch (e) {
            console.error('Error saving database:', e)
        }
    }

    getChat(jid) {
        if (!global.db.data.chats[jid]) {
            global.db.data.chats[jid] = {
                jid,
                isBanned: false,
                welcome: true,
                antiArab: false,
                detect: true,
                sWelcome: '',
                sBye: '',
                sPromote: '',
                sDemote: ''
            }
        }
        return global.db.data.chats[jid]
    }
}

export default new Store()
