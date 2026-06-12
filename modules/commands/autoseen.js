const fs = require('fs-extra')
const pathFile = `${__dirname}/data/config/autoseen.json`
if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, JSON.stringify({ enabled: true }, null, 2))

module.exports.config = {
  name: 'autoseen',
  version: '1.0.0',
  hasPermssion: 3,
  credits: 'NTKhang',
  description: 'Bật/tắt tự động seen khi có tin nhắn mới',
  commandCategory: 'Nhóm',
  usages: 'on/off',
  cooldowns: 5,
}

module.exports.handleEvent = async ({ api, event, args }) => {
  const data = JSON.parse(fs.readFileSync(pathFile, 'utf-8'))
  if (data.enabled) api.markAsReadAll(() => {})
}

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === 'on') {
      fs.writeFileSync(pathFile, JSON.stringify({ enabled: true }, null, 2))
      api.sendMessage(
        'Đã bật chế độ tự động seen khi có tin nhắn mới',
        event.threadID,
        event.messageID
      )
    } else if (args[0] === 'off') {
      fs.writeFileSync(pathFile, JSON.stringify({ enabled: false }, null, 2))
      api.sendMessage(
        'Đã tắt chế độ tự động seen khi có tin nhắn mới',
        event.threadID,
        event.messageID
      )
    } else {
      api.sendMessage('Sai cú pháp', event.threadID, event.messageID)
    }
  } catch (e) {
    console.log(e)
  }
}
