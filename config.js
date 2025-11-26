import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
    ['50686713454', 'Owner', true],
    ['79032347549903', 'Owner (Internal ID)', true] // Este es TU mismo usuario detectado por ID interno
]

global.mods = []
global.prems = []

global.packname = 'WhatsApp Bot'
global.author = 'Bot Admin'
global.botName = 'Comprehensive Bot'

global.sessionName = 'session'

global.prefix = /^[.#!]/i

// APIs
global.APIs = {
    nrtm: 'https://fg-nrtm.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
}

global.APIKeys = {
    'https://api-fgmods.ddns.net': 'fg-dylux'
}

// Bot Options
global.opts = {
    autoRead: true,
    self: false,
}

// Database placeholder
global.db = {
    data: {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {}
    }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
