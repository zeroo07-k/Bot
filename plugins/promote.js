export default {
    command: ['promote'],
    description: 'Promote a user to admin',
    admin: true,
    botAdmin: true,
    owner: false,
    group: true,

    async execute(conn, m, { isBotAdmin, isAdmin, isOwner }) {
        if (!isBotAdmin) return m.reply('*[❗] I need to be admin to do this action*')
        if (!isAdmin && !isOwner) return m.reply('*[❗] You need to be a group admin to use this command*')

        let users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

        // ROBUST QUOTED DETECTION
        // 1. Try m.quoted.sender (from smsg)
        if (m.quoted && m.quoted.sender) {
            users.push(m.quoted.sender)
        }
        // 2. Try raw contextInfo participant (fallback)
        else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
            users.push(m.message.extendedTextMessage.contextInfo.participant)
        }

        // Remove duplicates and normalize
        users = [...new Set(users)].map(u => conn.decodeJid(u))

        if (users.length === 0) {
            await conn.sendMessage(m.key.remoteJid, {
                text: '❌ Please mention a user or reply to a message to promote!\nExample: .promote @user'
            }, { quoted: m })
            return
        }

        try {
            await conn.groupParticipantsUpdate(m.key.remoteJid, users, 'promote')
            await conn.sendMessage(m.key.remoteJid, {
                text: `✅ Promoted successfully!`,
                mentions: users
            }, { quoted: m })
        } catch (e) {
            console.error(e)
            await conn.sendMessage(m.key.remoteJid, { text: '❌ Failed to promote.' }, { quoted: m })
        }
    }
}
