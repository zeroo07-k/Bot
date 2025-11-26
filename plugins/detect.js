export default {
    command: ['detect'],
    description: 'Toggle detect promote/demote announcements',
    admin: true,
    botAdmin: false,
    owner: false,
    group: true,

    async execute(conn, m, { args, chat }) {
        const action = args[0]?.toLowerCase()

        if (!action || !['on', 'off'].includes(action)) {
            await conn.sendMessage(m.key.remoteJid, {
                text: `❌ Usage: .detect on/off\n\nCurrent status: ${chat.detect ? 'ON' : 'OFF'}`
            }, { quoted: m })
            return
        }

        chat.detect = action === 'on'

        await conn.sendMessage(m.key.remoteJid, {
            text: `✅ Promotion/Demotion detection ${chat.detect ? 'enabled' : 'disabled'}!`
        }, { quoted: m })
    }
}
