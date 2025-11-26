export default {
    command: ['ban'],
    description: 'Ban a chat from using the bot',
    admin: false,
    botAdmin: false,
    owner: true,
    group: false,

    async execute(conn, m, { chat }) {
        chat.isBanned = true

        await conn.sendMessage(m.key.remoteJid, {
            text: '⛔ This chat has been banned from using the bot!'
        }, { quoted: m })
    }
}
