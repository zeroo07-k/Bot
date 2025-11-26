export default {
    command: ['menu', 'help', 'commands'],
    description: 'Show all available commands',
    admin: false,
    botAdmin: false,
    owner: false,
    group: false,

    async execute(conn, m) {
        const menu = `
╭━━━━━━━━━━━━━━━━━━━╮
│  📱 *BOT MENU*
╰━━━━━━━━━━━━━━━━━━━╯

┌─ *GENERAL COMMANDS*
│ • .ping
│ • .menu
│ • .info
└────────────────

┌─ *ADMIN COMMANDS*
│ • .open
│ • .close
│ • .kick @user
│ • .promote @user
│ • .demote @user
│ • .antiarab on/off
│ • .welcome on/off
│ • .detect on/off
└────────────────

┌─ *OWNER COMMANDS*
│ • .ban
│ • .unban
└────────────────

_Powered by WhatsApp Bot_
        `.trim()

        await conn.sendMessage(m.key.remoteJid, {
            text: menu
        }, { quoted: m })
    }
}
