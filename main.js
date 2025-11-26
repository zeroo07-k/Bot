import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidDecode } from '@whiskeysockets/baileys'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { handler, participantsUpdate } from './handler.js'
import connect from './server.js'
import chalk from 'chalk'
import qrcode from 'qrcode-terminal'
import store from './src/libraries/store.js'

global.conn = null

export async function start() {
    console.log(chalk.yellow('🚀 Starting WhatsApp Bot...'))

    await store.load()
    console.log(chalk.green('✓ Store initialized'))

    const { state, saveCreds } = await useMultiFileAuthState('session')
    const { version } = await fetchLatestBaileysVersion()
    console.log(chalk.cyan(`Using Baileys v${version.join('.')}`))

    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        browser: ['WhatsApp Bot', 'Safari', '1.0.0'],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        version
    })

    global.conn = conn

    // Helper to decode JID (MANDATORY for admin logic)
    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            console.log(chalk.yellow('📱 Scan the QR code below:'))
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(chalk.red('❌ Bad Session, Delete and Scan Again'))
                process.exit()
            } else if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.timedOut) {
                console.log(chalk.yellow("Reconnecting..."))
                start()
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(chalk.yellow("Restarting..."))
                start()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red('❌ Logged Out'))
                process.exit()
            } else {
                console.log(chalk.red(`Disconnect: ${reason}`))
                start()
            }
        }

        if (connection === 'open') {
            console.log(chalk.green('✅ Connected to WhatsApp'))
            const user = conn.user.id.split(':')[0]
            console.log(chalk.bgMagenta.white(` 🤖 LOGGED IN AS: ${user} `))
            console.log(chalk.bgBlue.white(` 👑 OWNER CONFIGURED: ${global.owner[0][0]} `))

            if (user !== global.owner[0][0]) {
                console.log(chalk.bgRed.white(' ⚠️ WARNING: BOT NUMBER DOES NOT MATCH OWNER NUMBER! '))
            }
        }
    })

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            await handler(chatUpdate, conn)
        } catch (e) {
            console.error(chalk.red('Handler error:'), e)
        }
    })

    conn.ev.on('group-participants.update', async (update) => {
        try {
            await participantsUpdate(update, conn)
        } catch (e) {
            console.error(chalk.red('Participants error:'), e)
        }
    })

    connect(conn, process.env.PORT || 3000)

    setInterval(async () => {
        await store.save()
    }, 30000)
}

// start() is called by index.js
