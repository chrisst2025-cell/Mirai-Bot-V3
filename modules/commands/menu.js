module.exports.config = {
  name: 'menu',
  version: '1.2.0',
  hasPermssion: 0,
  credits: 'DC-Nam & DongDev',
  description: 'Xem danh sách nhóm lệnh, thông tin lệnh',
  commandCategory: 'Hệ thống',
  usages: '[...name commands|all]',
  cooldowns: 5,
  envConfig: {
    autoUnsend: { status: true, timeOut: 60 },
  },
}

const { findBestMatch } = require('string-similarity')
const axios = require('axios')
const moment = require('moment-timezone')

// Hàm lấy Prefix nhanh
const getPrefix = (tid) => global.data.threadData.get(tid)?.PREFIX || global.config.PREFIX

// Hàm tải ảnh/gif làm attachment với retry
async function getStream(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      return response.data
    } catch (_e) {
      if (attempt === maxRetries) return null
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

// URL GIF mặc định
const DEFAULT_GIF_URL = 'https://i.imgur.com/RG6mRkg.gif'

module.exports.run = async function ({ api, event, args }) {
  const { sendMessage: send, unsendMessage: un } = api
  const { threadID: tid, messageID: mid, senderID: sid } = event
  const cmds = global.client.commands
  const configMenu = global.config?.menu || {}
  const autoUnsend = { ...this.config.envConfig.autoUnsend, ...configMenu.autoUnsend }

  const time = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss || DD/MM/YYYY')
  const img = await getStream(DEFAULT_GIF_URL)
  const attachment = img ? [img] : []

  // Xử lý gửi tin nhắn kèm tự động gỡ
  const sendWithAutoUnsend = async (data, callback) => {
    return send(
      data,
      tid,
      (err, info) => {
        if (callback) callback(err, info)
        if (autoUnsend.status && !err) {
          setTimeout(() => un(info.messageID, tid), autoUnsend.timeOut * 1000)
        }
      },
      mid
    )
  }

  // 1. Xem chi tiết 1 lệnh hoặc tất cả
  if (args.length >= 1) {
    if (args[0] === 'all') {
      let txt = '╭─────────────⭓\n'
      let count = 0
      for (const [name, cmd] of cmds) {
        txt += `│ ${++count}. ${name} | ${cmd.config.description}\n`
      }
      txt += `\n├────────⭔\n│ ⏳ Tự động gỡ sau: ${autoUnsend.timeOut}s\n╰─────────────⭓`
      const msgData = { body: txt }
      if (attachment.length > 0) msgData.attachment = attachment
      return sendWithAutoUnsend(msgData)
    }

    const command = cmds.get(args.join(' '))
    if (command) {
      return send(infoCmds(command.config), tid, mid)
    } else {
      const arrayCmds = Array.from(cmds.keys())
      const match = findBestMatch(args.join(' '), arrayCmds)
      if (match.bestMatch.rating >= 0.3) {
        return send(
          `❓ Không thấy lệnh "${args.join(' ')}", ý bạn là "${match.bestMatch.target}"?`,
          tid,
          mid
        )
      }
      return send(`❌ Không tìm thấy lệnh bạn yêu cầu.`, tid, mid)
    }
  }

  // 2. Menu chính theo nhóm (Mặc định)
  const dataGr = commandsGroup()
  let txt = '╭─────────────⭓\n'
  dataGr.forEach((gr, index) => {
    txt += `│ ${index + 1}. ${gr.commandCategory} [${gr.commandsName.length}]\n`
  })
  txt += `├────────⭔\n│ 📝 Tổng: ${cmds.size} lệnh\n│ ⏰ Time: ${time}\n│ 🔎 Reply số để chọn\n│ ⏳ Gỡ sau: ${autoUnsend.timeOut}s\n╰─────────────⭓`

  const msgData = { body: txt }
  if (attachment.length > 0) msgData.attachment = attachment
  return sendWithAutoUnsend(msgData, (_err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: sid,
      case: 'infoGr',
      data: dataGr,
    })
  })
}

module.exports.handleReply = async function ({ handleReply: $, api, event }) {
  const { sendMessage: send, unsendMessage: un } = api
  const { threadID: tid, messageID: mid, senderID: sid, args } = event

  if (sid !== $.author) return send(`⛔ Bạn không phải người gọi menu!`, tid, mid)

  const configMenu = global.config?.menu || {}
  const autoUnsend = { ...this.config.envConfig.autoUnsend, ...configMenu.autoUnsend }

  const sendWithAutoUnsend = async (data, callback) => {
    return send(
      data,
      tid,
      (err, info) => {
        if (callback) callback(err, info)
        if (autoUnsend.status && !err) {
          setTimeout(() => un(info.messageID, tid), autoUnsend.timeOut * 1000)
        }
      },
      mid
    )
  }

  try {
    switch ($.case) {
      case 'infoGr': {
        const selectedGr = $.data[parseInt(args[0], 10) - 1]
        if (!selectedGr) return send(`❎ Số thứ tự "${args[0]}" không hợp lệ`, tid, mid)

        await un($.messageID, tid)
        let txt = `╭── ${selectedGr.commandCategory.toUpperCase()} ──⭓\n`
        selectedGr.commandsName.forEach((name, i) => {
          const cmdInfo = global.client.commands.get(name).config
          txt += `│ ${i + 1}. ${name} | ${cmdInfo.description}\n`
        })
        txt += `├────────⭔\n│ 🔎 Reply số để xem chi tiết\n│ ⏳ Gỡ sau: ${autoUnsend.timeOut}s\n│ 📝 Prefix: ${getPrefix(tid)}\n╰─────────────⭓`

        return sendWithAutoUnsend({ body: txt }, (_err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: sid,
            case: 'infoCmds',
            data: selectedGr.commandsName,
          })
        })
      }

      case 'infoCmds': {
        const cmdName = $.data[parseInt(args[0], 10) - 1]
        const command = global.client.commands.get(cmdName)
        if (!command) return send(`⚠️ Lệnh không tồn tại`, tid, mid)

        await un($.messageID, tid)
        return send(infoCmds(command.config), tid, mid)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

function commandsGroup() {
  const groups = new Map()
  for (const [name, cmd] of global.client.commands) {
    const cat = cmd.config.commandCategory || 'Khác'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push(name)
  }
  return Array.from(groups, ([commandCategory, commandsName]) => ({
    commandCategory,
    commandsName,
  })).sort((a, b) => b.commandsName.length - a.commandsName.length)
}

function infoCmds(a) {
  return `╭── INFO ────⭓\n│ 📔 Tên: ${a.name}\n│ 🌴 Ver: ${a.version}\n│ 🔐 Quyền: ${premssionTxt(a.hasPermssion)}\n│ 👤 Tác giả: ${a.credits}\n│ 🌾 Mô tả: ${a.description}\n│ 📎 Nhóm: ${a.commandCategory}\n│ 📝 Dùng: ${a.usages}\n│ ⏳ Chờ: ${a.cooldowns}s\n╰─────────────⭓`
}

function premssionTxt(a) {
  const roles = ['Thành Viên', 'Quản Trị Viên Nhóm', 'ADMINBOT', 'Người Điều Hành']
  return roles[a] || roles[0]
}
