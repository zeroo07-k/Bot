export default {
    command: ['open', 'abrir'],
    description: 'Open group (allow all members to send messages)',
    admin: true,
    botAdmin: true,
    owner: false,
    group: true,

    async execute(conn, m, { isBotAdmin, isAdmin, isOwner }) {
        if (!isBotAdmin) return m.reply('*[❗] I need to be admin to do this action*')
        if (!isAdmin && !isOwner) return m.reply('*[❗] You need to be a group admin to use this command*')

        await conn.groupSettingUpdate(m.key.remoteJid, 'not_announcement')
        await conn.sendMessage(m.key.remoteJid, {
            text: '✅ Group opened! All members can now send messages.'
        }, { quoted: m })
    }
}
