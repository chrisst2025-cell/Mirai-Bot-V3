module.exports.config = {
  name: 'console',
  version: '1.0.0',
  hasPermssion: 2,
  credits: '',
  description: 'Bật/tắt console',
  commandCategory: 'Admin',
  usages: 'console',
  cooldowns: 5,
}

const axios = require('axios')
const moment = require('moment-timezone')
const { co } = require('../../utils/log')
const fs = require('fs-extra')
const path = require('node:path')

const userCache = new Map()
const threadCache = new Map()
const CACHE_TTL = 10 * 60 * 1000
const thinhCache = { data: null, timestamp: 0 }
const THINH_CACHE_TTL = 60 * 60 * 1000

async function getRandomThinh() {
  const now = Date.now()
  if (thinhCache.data && now - thinhCache.timestamp < THINH_CACHE_TTL) {
    const keys = Object.keys(thinhCache.data)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    return thinhCache.data[randomKey]
  }
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/Sang070801/api/main/thinh1.json'
    )
    const data = response.data?.data
    if (typeof data === 'object' && !Array.isArray(data)) {
      thinhCache.data = data
      thinhCache.timestamp = now
      const keys = Object.keys(data)
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      return data[randomKey]
    }
  } catch (err) {
    console.error('Lỗi lấy thính từ API:', err)
  }
  return 'Không có câu thính nào.'
}

async function getUserName(Users, senderID) {
  const now = Date.now()
  if (userCache.has(senderID)) {
    const { name, timestamp } = userCache.get(senderID)
    if (now - timestamp < CACHE_TTL) return name
  }
  try {
    const name = (await Users.getNameUser(senderID)) || 'Unknown User'
    userCache.set(senderID, { name, timestamp: now })
    return name
  } catch (_err) {
    return 'Unknown User'
  }
}

async function getThreadName(api, Threads, threadID) {
  const now = Date.now()
  if (threadCache.has(threadID)) {
    const { name, timestamp } = threadCache.get(threadID)
    if (now - timestamp < CACHE_TTL) return name
  }
  try {
    let threadInfo = await Threads.getData(threadID)
    if (!threadInfo?.threadInfo?.threadName) {
      threadInfo = await api.getThreadInfo(threadID)
    }
    const name =
      threadInfo?.threadInfo?.threadName || threadInfo?.threadName || `Thread ${threadID}`
    threadCache.set(threadID, { name, timestamp: now })
    return name
  } catch (_err) {
    return `Thread ${threadID}`
  }
}

function padRight(str, len) {
  const s = String(str)
  if (s.length >= len) return s
  return s + ' '.repeat(len - s.length)
}

function makeBorder(_title, width) {
  const line = '─'.repeat(Math.max(0, width - 2))
  const top = `╭${line}╮`
  const bottom = `╰${line}╯`
  return { top: co(top), bottom: co(bottom) }
}

module.exports.run = async ({ api, event }) => {
  const configPath = path.join(process.cwd(), 'config.json')
  let config = {}
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch (err) {
    console.error(err)
  }

  global.config.console = !global.config.console
  config.console = global.config.console

  fs.writeFileSync(configPath, JSON.stringify(config, null, 4))

  const status = global.config.console ? 'Bật' : 'Tắt'
  return api.sendMessage(`☑️ Đã ${status} log chat trên console.`, event.threadID)
}

module.exports.handleEvent = async ({ api, event, Users, Threads }) => {
  if (!global.config.console) return

  if (
    event.type === 'message' ||
    event.type === 'message_reply' ||
    event.type === 'message_unsend'
  ) {
    const botID = api.getCurrentUserID()
    if (event.senderID !== botID) {
      try {
        const [nameUser, nameBox] = await Promise.all([
          getUserName(Users, event.senderID),
          getThreadName(api, Threads, event.threadID),
        ])

        let msg = event.body?.trim() ? event.body.trim() : ''
        if (!msg) {
          if (event.attachments?.length) msg = `📎 ${event.attachments.length} attachment(s)`
          else msg = '📎 Ảnh, video hoặc ký tự đặc biệt'
        }

        const time = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
        const width = 60 // box width
        const title = ` ${nameBox} `
        const { top, bottom } = makeBorder(title, width)

        const labelWidth = 14
        const lines = []
        lines.push(top)
        lines.push(co(`│ ${padRight('[📌] Tên nhóm:', labelWidth)} ${nameBox}`))
        lines.push(co(`│ ${padRight('[👥] ID nhóm:', labelWidth)} ${event.threadID}`))
        lines.push(co(`│ ${padRight('[💢] Người dùng:', labelWidth)} ${nameUser}`))
        lines.push(co(`│ ${padRight('[🆔] ID người dùng:', labelWidth)} ${event.senderID}`))
        lines.push(co(`│ ${padRight('[💬] Nội dung:', labelWidth)} ${msg}`))
        lines.push(co(`│ ${padRight('[🕐] Thời gian:', labelWidth)} ${time}`))
        lines.push(bottom)

        const thinh = await getRandomThinh()
        lines.push('')
        lines.push(co(`${thinh}`))
        lines.push('')

        console.log(lines.join('\n'))
      } catch (error) {
        console.error('Lỗi log message:', error)
      }
    }
  }
}
