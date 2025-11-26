import { jidNormalizedUser } from './simple.js'

export function isUrl(text) {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi'))
}

export function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export function getBuffer(url, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios({
                method: "get",
                url,
                headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                },
                ...options,
                responseType: 'arraybuffer'
            })
            resolve(res.data)
        } catch (e) {
            reject(e)
        }
    })
}

export function formatNumber(num) {
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return formatted
}

export function msToTime(duration) {
    const milliseconds = parseInt((duration % 1000) / 100)
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    const hoursStr = (hours < 10) ? "0" + hours : hours
    const minutesStr = (minutes < 10) ? "0" + minutes : minutes
    const secondsStr = (seconds < 10) ? "0" + seconds : seconds

    return hoursStr + ":" + minutesStr + ":" + secondsStr
}

export function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
