// Utility functions for the bot

export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
}

export function isUrl(text) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(text)
}

export function parseJid(jid) {
    if (!jid) return null
    const match = jid.match(/(\d+)@/)
    return match ? match[1] : null
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}
