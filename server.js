import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function connect(conn, PORT) {
    const app = express()
    const server = createServer(app)

    app.use(express.json())
    app.use(express.static(path.join(__dirname, 'views')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'index.html'))
    })

    app.get('/api/status', (req, res) => {
        res.json({
            status: 'online',
            connected: conn?.user ? true : false,
            user: conn?.user?.name || 'Not connected'
        })
    })

    server.listen(PORT, () => {
        console.log(chalk.green(`🌐 Server running on port ${PORT}`))
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(chalk.yellow(`⚠️ Port ${PORT} is already in use, server not started`))
        } else {
            console.error(chalk.red('Server error:'), err)
        }
    })
}

export default connect
