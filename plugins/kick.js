export default {
    command: ['kick', 'remove'],
    description: 'Kick a user from the group',
    admin: true,
    botAdmin: true,
    owner: false,
    group: true,

    async execute(conn, m, { isBotAdmin, isAdmin, isOwner }) {
        if (!isBotAdmin) return m.reply('*[❗] I need to be admin to do this action*')
        if (!isAdmin && !isOwner) return m.reply('*[❗] You need to be a group admin to use this command*')

        const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid

        if (!mentionedJid || mentionedJid.length === 0) {
            await conn.sendMessage(m.key.remoteJid, {
                text: '❌ Please mention a user to kick!\nExample: .kick @user'
            }, { quoted: m })
            return
        }

        await conn.groupParticipantsUpdate(m.key.remoteJid, mentionedJid, 'remove')

        await conn.sendMessage(m.key.remoteJid, {
            text: '✅ User(s) removed from the group!',
            mentions: mentionedJid
        }, { quoted: m })
    }
}
