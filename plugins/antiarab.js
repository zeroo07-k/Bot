export default {
    command: ['antiarab', 'antifake'],
    description: 'Toggle anti-arab/fake number protection',
    admin: true,
    botAdmin: false,
    owner: false,
    group: true,

    async execute(conn, m, { args, chat }) {
        const action = args[0]?.toLowerCase()

        if (!action || !['on', 'off'].includes(action)) {
            await conn.sendMessage(m.key.remoteJid, {
                text: `❌ Usage: .antiarab on/off\n\nCurrent status: ${chat.antiArab ? 'ON' : 'OFF'}`
            }, { quoted: m })
            return
        }

        chat.antiArab = action === 'on'

        await conn.sendMessage(m.key.remoteJid, {
            text: `✅ Anti-Arab protection ${chat.antiArab ? 'enabled' : 'disabled'}!`
        }, { quoted: m })
    }
}
