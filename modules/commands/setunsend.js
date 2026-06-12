const fs = require('node:fs')
const path = require('node:path')

module.exports.config = {
  name: 'setunsend',
  version: '1.0.0',
  hasPermssion: 1, // Yêu cầu quyền quản trị viên nhóm
  credits: 'Developer',
  description: 'Cài đặt reaction để bot tự động thu hồi tin nhắn của bot',
  commandCategory: 'Nhóm',
  usages: '[emoji]',
  cooldowns: 5,
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event
  const icon = args[0]

  if (!icon) {
    return api.sendMessage(
      '❌ Bạn phải nhập một emoji để làm reaction thu hồi tin nhắn!\n💡 Ví dụ: !setunsend 😡',
      threadID,
      messageID
    )
  }

  const unsendPath = path.join(__dirname, 'data', 'unsend.json')
  let data = []

  if (fs.existsSync(unsendPath)) {
    try {
      data = JSON.parse(fs.readFileSync(unsendPath, 'utf8'))
    } catch (_e) {
      data = []
    }
  } else {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })
  }

  const threadIndex = data.findIndex((item) => item.threadID === String(threadID))

  if (threadIndex !== -1) {
    data[threadIndex].Icon = icon
  } else {
    data.push({
      threadID: String(threadID),
      Icon: icon,
    })
  }

  fs.writeFileSync(unsendPath, JSON.stringify(data, null, 2), 'utf8')

  return api.sendMessage(
    `✅ Đã cài đặt reaction thu hồi tin nhắn cho nhóm này là: ${icon}\n📌 Khi có người thả cảm xúc này vào tin nhắn của bot, bot sẽ tự động gỡ tin nhắn đó.`,
    threadID,
    messageID
  )
}

module.exports.handleEvent = async ({ api, event }) => {
  if (event.type === 'message_reaction') {
    const { threadID, messageID, reaction } = event
    const unsendPath = path.join(__dirname, 'data', 'unsend.json')

    if (fs.existsSync(unsendPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(unsendPath, 'utf8'))
        const threadData = data.find((item) => item.threadID === String(threadID))

        if (threadData && threadData.Icon === reaction) {
          api.unsendMessage(messageID, (_err) => {})
        }
      } catch (e) {
        console.error('[SETUNSEND EVENT ERROR]', e)
      }
    }
  }
}
