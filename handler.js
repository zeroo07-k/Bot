import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import { smsg } from './src/libraries/simple.js'
import store from './src/libraries/store.js'
import Logger from './src/libraries/logs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const plugins = {}

// UNIVERSAL JID NORMALIZER
const normalizeJid = (jid) => {
    if (!jid) return null
    if (jid.includes('@lid')) return jid // Keep LIDs for mapping
    return jid.replace(/:\d+/, '').split('@')[0] + '@s.whatsapp.net'
}

async function loadPlugins() {
    const pluginFolder = path.join(__dirname, 'plugins')
    const files = readdirSync(pluginFolder).filter(file => file.endsWith('.js'))
    for (const file of files) {
        try {
            const module = await import(`./plugins/${file}?update=${Date.now()}`)
            plugins[file.replace('.js', '')] = module.default || module
            console.log(chalk.green(`✓ ${file.replace('.js', '')}`))
        } catch (e) {
            console.error(chalk.red(`✗ ${file}:`), e)
        }
    }
}

await loadPlugins()

export async function handler(chatUpdate, conn) {
    try {
        let m = chatUpdate.messages[0]
        if (!m) return

        m = smsg(conn, m, store)
        if (!m.message) return
        if (m.key && m.key.remoteJid === 'status@broadcast') return
        if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return

        // 1. Get Group Metadata & Participants (FRESH)
        const groupMetadata = m.isGroup ? await conn.groupMetadata(m.key.remoteJid).catch(_ => null) : null

        // Anti-crash: If metadata fails in group, notify and return
        if (!groupMetadata && m.isGroup) {
            await conn.sendMessage(m.key.remoteJid, { text: '😓 No pude obtener la información del grupo, intentaré nuevamente...' }, { quoted: m })
            return
        }

        const participants = m.isGroup ? groupMetadata.participants : []

        // 2. Normalize Sender & Bot JID
        m.sender = conn.decodeJid(m.sender)
        const botJid = conn.decodeJid(conn.user.id)

        // 3. Admin Detection (detects both 'admin' and 'superadmin')
        const getRole = (jid) => {
            if (!m.isGroup) return null
            const participant = participants.find(p => conn.decodeJid(p.id) === jid)
            return participant?.admin || null
        }

        const botRole = getRole(botJid)
        const senderRole = getRole(m.sender)

        const isBotAdmin = ['admin', 'superadmin'].includes(botRole)
        const isAdmin = ['admin', 'superadmin'].includes(senderRole)

        // 4. Owner Detection
        const senderNumber = m.sender.split('@')[0].replace(/[^0-9]/g, '')
        const ownerNumbers = global.owner.map(([number]) => number.replace(/[^0-9]/g, ''))
        const isOwner = ownerNumbers.includes(senderNumber) || m.fromMe

        const chat = store.getChat(m.key.remoteJid)

        // Parse Command
        const body = (m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || '').trim()
        const prefixMatch = body.match(global.prefix)
        const prefix = prefixMatch ? prefixMatch[0] : '.'
        const isCmd = body.startsWith(prefix)
        const command = isCmd ? body.slice(prefix.length).split(' ')[0].toLowerCase() : ''
        const args = body.slice(prefix.length + command.length).trim().split(' ').filter(v => v)

        if (isCmd) {
            Logger.command(m.sender, command, m.isGroup)
        }

        if (chat.isBanned && !isOwner) return

        for (const [name, plugin] of Object.entries(plugins)) {
            if (!plugin.command) continue
            const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
            if (!commands.includes(command)) continue

            // SKIP BOT ADMIN CHECK FOR OWNER
            if (plugin.botAdmin && !isBotAdmin && !isOwner) {
                await conn.sendMessage(m.key.remoteJid, { text: '🚫 Necesito ser admin para ayudarte con esto. Conviérteme en administrador y volvemos a intentarlo.' }, { quoted: m })
                continue
            }
            // ALLOW OWNER TO BYPASS ADMIN CHECK
            if (plugin.admin && !isAdmin && !isOwner) {
                await conn.sendMessage(m.key.remoteJid, { text: '🙋‍♂️ Este comando es solo para administradores o el dueño. Si necesitas usarlo, pide permisos o promuévete primero.' }, { quoted: m })
                continue
            }
            if (plugin.owner && !isOwner) {
                await conn.sendMessage(m.key.remoteJid, { text: '👑 Solo el propietario del bot puede usar este comando. ¡Gracias por entender!' }, { quoted: m })
                continue
            }
            if (plugin.group && !m.isGroup) {
                await conn.sendMessage(m.key.remoteJid, { text: '🧑‍🤝‍🧑 Este comando solo funciona en grupos. Pruébalo allí para que todo salga bien.' }, { quoted: m })
                continue
            }

            try {
                await plugin.execute(conn, m, { args, command, prefix, isAdmin, isBotAdmin, isOwner, groupMetadata, participants, chat })
            } catch (e) {
                console.error(chalk.red(`Error ${name}:`), e)
                await conn.sendMessage(m.key.remoteJid, { text: `💥 Ups, algo salió mal: ${e.message}` }, { quoted: m })
            }
        }
    } catch (e) {
        console.error(chalk.red('Handler error:'), e)
    }
}

export async function participantsUpdate({ id, participants, action }, conn) {
    try {
        const groupMetadata = await conn.groupMetadata(id).catch(() => null)
        if (!groupMetadata) return

        const botJid = conn.decodeJid(conn.user.id)
        const isBotAdmin = groupMetadata.participants.some(p => conn.decodeJid(p.id) === botJid && (p.admin === 'admin' || p.admin === 'superadmin'))
        const chat = store.getChat(id)

        console.log(chalk.yellow(`[Group Update] ${action} in ${id}`))

        for (const user of participants) {
            const userNumber = user.split('@')[0]
            const prefix3 = userNumber.substring(0, 3)
            const prefix2 = userNumber.substring(0, 2)

            if (action === 'add' && chat.antiArab && isBotAdmin && (['212', '265', '234'].includes(prefix3) || ['92'].includes(prefix2))) {
                await conn.groupParticipantsUpdate(id, [user], 'remove')
                await conn.sendMessage(id, { text: `⚠️ ${userNumber} removed (Anti-Fake)` })
            }

            if (chat.welcome) {
                if (action === 'add') await conn.sendMessage(id, { text: chat.sWelcome || `Welcome @${userNumber}!`, mentions: [user] })
                else if (action === 'remove') await conn.sendMessage(id, { text: chat.sBye || `Goodbye @${userNumber}!`, mentions: [user] })
            }

            if (chat.detect) {
                if (action === 'promote') await conn.sendMessage(id, { text: chat.sPromote || `@${userNumber} is now admin!`, mentions: [user] })
                else if (action === 'demote') await conn.sendMessage(id, { text: chat.sDemote || `@${userNumber} no longer admin!`, mentions: [user] })
            }
        }
    } catch (e) {
        console.error(chalk.red('Participants error:'), e)
    }
}

let file = fileURLToPath(import.meta.url)
