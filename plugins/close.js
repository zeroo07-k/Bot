export default {
    command: ['close', 'cerrar'],
    description: 'Close group (only admins can send messages)',
    admin: true,
    botAdmin: true,
    owner: false,
    group: true,

    async execute(conn, m, { isBotAdmin, isAdmin, isOwner }) {
        if (!isBotAdmin) return m.reply('*[❗] I need to be admin to do this action*')
        if (!isAdmin && !isOwner) return m.reply('*[❗] You need to be a group admin to use this command*')

        await conn.groupSettingUpdate(m.key.remoteJid, 'announcement')
        await conn.sendMessage(m.key.remoteJid, {
            text: '🔒 Group closed! Only admins can send messages now.'
        }, { quoted: m })
    }
}
