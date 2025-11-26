export default {
    command: ['info', 'botinfo'],
    description: 'Show bot information',
    admin: false,
    botAdmin: false,
    owner: false,
    group: false,

    async execute(conn, m) {
        const info = `
*BOT INFORMATION*

📱 *Name:* ${global.botName}
👤 *Author:* ${global.author}
📦 *Package:* ${global.packname}
⚡ *Platform:* Baileys v6.6
🟢 *Status:* Active

_Built with Node.js_
        `.trim()

        await conn.sendMessage(m.key.remoteJid, {
            text: info
        }, { quoted: m })
    }
}
