# 🤖 Comprehensive WhatsApp Bot

A modular, production-ready WhatsApp Bot built with Node.js and Baileys.

## ✨ Features

- 🔌 Modular plugin system
- 👥 Advanced admin detection
- 🛡️ Anti-spam & Anti-fake number protection
- 📊 Group management (open/close, welcome/bye)
- 🌐 Web interface for status monitoring
- 🚀 Multiple deployment options (Docker, Heroku, Render)

## 📋 Requirements

- Node.js 18+
- Git

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Bot

# Install dependencies
npm install

# Start the bot
npm start
```

### First Run

1. Run `npm start`
2. Scan the QR code with WhatsApp
3. Bot is ready!

## 📁 Project Structure

```
Bot/
├── plugins/          # Command plugins
├── src/             # Source utilities
├── views/           # Web interface
├── config.js        # Configuration
├── handler.js       # Message handler
├── main.js          # Baileys connection
├── index.js         # Entry point
└── server.js        # Web server
```

## 🔧 Configuration

Edit `config.js` to customize:

- **Owner numbers**: `global.owner`
- **Bot name**: `global.botName`
- **Prefix**: `global.prefix`
- **APIs**: `global.APIs` and `global.APIKeys`

## 📝 Available Commands

### General
- `.ping` - Test bot response
- `.menu` - Show all commands
- `.info` - Bot information

### Admin Only
- `.open` - Open group (anyone can send messages)
- `.close` - Close group (only admins can send)
- `.antiarab on/off` - Toggle anti-fake protection
- `.kick @user` - Remove user from group
- `.promote @user` - Make user admin
- `.demote @user` - Remove admin privileges

### Owner Only
- `.ban` - Ban chat from using bot
- `.unban` - Unban chat

## 🐳 Deployment

### Docker

```bash
docker build -t whatsapp-bot .
docker run -p 3000:3000 whatsapp-bot
```

### Heroku

```bash
heroku create
git push heroku main
```

### Render

1. Connect your GitHub repository
2. Use `render.yaml` configuration
3. Deploy

## 🛠️ Development

### Adding New Plugins

Create a new file in `plugins/` folder:

```javascript
export default {
    command: ['commandname', 'alias'],
    description: 'Command description',
    admin: false,      // Requires admin
    botAdmin: false,   // Requires bot admin
    owner: false,      // Requires owner
    group: true,       // Only in groups
    
    async execute(conn, m, { args }) {
        await conn.sendMessage(m.key.remoteJid, {
            text: 'Hello!'
        }, { quoted: m })
    }
}
```

### Testing

```bash
npm test
```

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

## ⚠️ Disclaimer

This bot is for educational purposes. Use responsibly and comply with WhatsApp's Terms of Service.
