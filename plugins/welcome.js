export default {
    command: ['welcome'],
    description: 'Toggle welcome/bye messages',
    admin: true,
    botAdmin: false,
    owner: false,
    group: true,

    async execute(conn, m, { args, chat }) {
        const action = args[0]?.toLowerCase()

        if (!action || !['on', 'off'].includes(action)) {
            await conn.sendMessage(m.key.remoteJid, {
                text: `❌ Usage: .welcome on/off\n\nCurrent status: ${chat.welcome ? 'ON' : 'OFF'}`
            }, { quoted: m })
            return
        }

        chat.welcome = action === 'on'

        await conn.sendMessage(m.key.remoteJid, {
            text: `✅ Welcome messages ${chat.welcome ? 'enabled' : 'disabled'}!`
        }, { quoted: m })
    }
}
