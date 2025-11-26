// Database helper functions (placeholder - can be expanded with real DB)

export function getUserData(userId) {
    if (!global.db.data.users[userId]) {
        global.db.data.users[userId] = {
            name: '',
            age: 0,
            exp: 0,
            limit: 10,
            lastclaim: 0,
            registered: false,
            regTime: -1,
            afk: -1,
            afkReason: '',
            banned: false,
            level: 0,
            role: 'user',
            autolevelup: true,
        }
    }
    return global.db.data.users[userId]
}

export function getChatData(chatId) {
    if (!global.db.data.chats[chatId]) {
        global.db.data.chats[chatId] = {
            isBanned: false,
            welcome: true,
            antiArab: false,
            detect: true,
            sWelcome: '',
            sBye: '',
            sPromote: '',
            sDemote: '',
            antiLink: false,
            antiBot: false,
            antiViewOnce: false,
            antiCall: false,
            antiSpam: false,
            antiToxic: false,
            autosticker: false,
        }
    }
    return global.db.data.chats[chatId]
}

export function saveDatabase() {
    // Placeholder for actual database save
    // In production, this would write to a file or database
    return true
}
