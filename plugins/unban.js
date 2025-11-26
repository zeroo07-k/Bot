export default {
    command: ['unban'],
    description: 'Unban a chat from using the bot',
    admin: false,
    botAdmin: false,
    owner: true,
    group: false,

    async execute(conn, m, { chat }) {
        chat.isBanned = false

        await conn.sendMessage(m.key.remoteJid, {
            text: '✅ This chat has been unbanned!'
        }, { quoted: m })
    }
}
