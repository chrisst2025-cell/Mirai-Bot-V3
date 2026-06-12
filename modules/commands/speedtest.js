const axios = require('axios')
module.exports.config = {
  name: 'speedtest',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'System',
  description: 'Kiểm tra tốc độ mạng bot',
  commandCategory: 'Tiện ích',
  usages: 'speedtest',
  cooldowns: 15,
}
module.exports.run = async ({ api, event }) => {
  const t0 = Date.now()
  try {
    await axios.get('https://www.google.com', { timeout: 5000 })
    const ping = Date.now() - t0
    const emoji = ping < 200 ? '🟢' : ping < 500 ? '🟡' : '🔴'
    api.sendMessage(
      `${emoji} Tốc độ mạng bot:\n⚡ Ping: ${ping}ms\n📶 Trạng thái: ${ping < 300 ? 'Tốt' : ping < 700 ? 'Trung bình' : 'Yếu'}`,
      event.threadID,
      event.messageID
    )
  } catch {
    api.sendMessage('❌ Không thể kết nối!', event.threadID, event.messageID)
  }
}
