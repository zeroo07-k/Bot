export default {
    command: ['ping', 'test'],
    description: 'Test bot response time',
    admin: false,
    botAdmin: false,
    owner: false,
    group: false,

    async execute(conn, m) {
        const start = Date.now()
        const sent = await conn.sendMessage(m.key.remoteJid, {
            text: '🏓 Pinging...'
        }, { quoted: m })

        const end = Date.now()
        const ping = end - start

        await conn.sendMessage(m.key.remoteJid, {
            text: `🏓 Pong!\n⏱️ Response time: ${ping}ms`,
            edit: sent.key
        })
    }
}
