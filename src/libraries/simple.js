export function smsg(conn, m, store) {
    if (!m) return m

    m.isGroup = m.key.remoteJid?.endsWith('@g.us') || false

    // Get actual sender - in groups use participant, in private use remoteJid
    if (m.key.fromMe) {
        m.sender = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    } else if (m.isGroup) {
        m.sender = m.key.participant || m.key.remoteJid
    } else {
        m.sender = m.key.remoteJid
    }

    m.reply = async (text) => {
        return await conn.sendMessage(m.key.remoteJid, { text }, { quoted: m })
    }

    m.react = async (emoji) => {
        return await conn.sendMessage(m.key.remoteJid, {
            react: { text: emoji, key: m.key }
        })
    }

    if (m.message) {
        m.type = Object.keys(m.message)[0]
        m.msg = m.message[m.type]

        if (m.msg?.contextInfo?.quotedMessage) {
            m.quoted = {
                key: {
                    remoteJid: m.key.remoteJid,
                    participant: m.msg.contextInfo.participant,
                    fromMe: false,
                    id: m.msg.contextInfo.stanzaId
                },
                message: m.msg.contextInfo.quotedMessage
            }
        }
    }

    m.text = m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption || ''

    return m
}

export function jidNormalizedUser(jid) {
    if (!jid) return null
    const parts = jid.split(':')
    const base = parts[0]
    if (base.includes('@')) return base
    return base + '@s.whatsapp.net'
}

export function areJidsSameUser(jid1, jid2) {
    return jidNormalizedUser(jid1) === jidNormalizedUser(jid2)
}
