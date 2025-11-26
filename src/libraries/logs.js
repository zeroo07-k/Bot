import chalk from 'chalk'
import moment from 'moment-timezone'

export class Logger {
    static info(message) {
        console.log(chalk.blue(`[INFO] ${moment().format('HH:mm:ss')} - ${message}`))
    }

    static success(message) {
        console.log(chalk.green(`[SUCCESS] ${moment().format('HH:mm:ss')} - ${message}`))
    }

    static warn(message) {
        console.log(chalk.yellow(`[WARN] ${moment().format('HH:mm:ss')} - ${message}`))
    }

    static error(message, error = null) {
        console.log(chalk.red(`[ERROR] ${moment().format('HH:mm:ss')} - ${message}`))
        if (error) console.error(error)
    }

    static command(user, command, isGroup) {
        const userNum = user.split('@')[0]
        const location = isGroup ? 'Group' : 'Private'
        console.log(chalk.cyan(`[CMD] ${moment().format('HH:mm:ss')} - ${command} by ${userNum} in ${location}`))
    }

    static debug(key, value) {
        console.log(chalk.magenta(`[DEBUG] ${key}: ${JSON.stringify(value)}`))
    }
}

export default Logger
