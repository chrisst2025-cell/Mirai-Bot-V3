module.exports.config = {
  name: 'anti',
  version: '5.0.0',
  hasPermssion: 1,
  credits: 'System',
  description: 'Anti change Box chat - Unified',
  commandCategory: 'Nhóm',
  usages: 'anti',
  cooldowns: 5,
  dependencies: {
    'fs-extra': '',
  },
}

const { readFileSync, writeFileSync, existsSync, ensureDirSync } = require('fs-extra')
const path = require('node:path')

const pathData = path.join(__dirname, 'data', 'config', 'anti.json')

function loadData() {
  ensureDirSync(path.join(__dirname, 'data', 'config'))
  try {
    if (existsSync(pathData)) {
      return JSON.parse(readFileSync(pathData, 'utf8'))
    }
  } catch (e) {
    console.error(e)
  }
  return {
    boxname: [],
    boximage: [],
    antiNickname: [],
    antiout: {},
    antijoin: {},
    antispam: {},
    antiemoji: {},
    antitheme: {},
    antiqtv: {},
  }
}

function saveData(data) {
  writeFileSync(pathData, JSON.stringify(data, null, 4))
}

const usersSpam = {}

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body } = event
  if (!senderID || senderID === api.getCurrentUserID()) return

  const data = loadData()
  if (!data.antispam) return
  const spamSettings = data.antispam[threadID]

  if (spamSettings?.enabled) {
    if (!usersSpam[senderID]) {
      usersSpam[senderID] = { count: 0, start: Date.now() }
    }

    usersSpam[senderID].count++

    if (Date.now() - usersSpam[senderID].start > spamSettings.spamTime) {
      if (usersSpam[senderID].count > spamSettings.spamCount) {
        api.removeUserFromGroup(senderID, threadID)
        api.sendMessage(
          {
            body: `🚫 Đã tự động kick người sử dụng vi phạm do spam quá mức cài đặt!`,
            mentions: [{ tag: `${senderID}`, id: senderID }],
          },
          threadID
        )
      }
      usersSpam[senderID].count = 0
      usersSpam[senderID].start = Date.now()
    }
  }
}

module.exports.handleReply = async ({ api, event, handleReply, Threads }) => {
  const { senderID, threadID, messageID, body } = event
  const { author, permssion, action } = handleReply

  if (author !== senderID) return api.sendMessage(`❎ Bạn không phải người dùng lệnh`, threadID)

  const dataAnti = loadData()

  if (action === 'spam_config') {
    const args = body.split(' ')
    if (args.length < 2)
      return api.sendMessage(
        '⚠️ Vui lòng nhập đúng định dạng: [số tin nhắn] [thời gian(ms)]. VD: 6 5000',
        threadID,
        messageID
      )
    const count = parseInt(args[0], 10)
    const time = parseInt(args[1], 10)
    if (Number.isNaN(count) || Number.isNaN(time))
      return api.sendMessage('⚠️ Thông số không hợp lệ!', threadID, messageID)

    dataAnti.antispam[threadID] = {
      enabled: true,
      spamCount: count,
      spamTime: time,
    }
    saveData(dataAnti)
    api.unsendMessage(
      handleReply.messageID,
      typeof event !== 'undefined'
        ? event.threadID
        : typeof e !== 'undefined'
          ? e.threadID
          : typeof _ !== 'undefined'
            ? _.threadID
            : ''
    )
    return api.sendMessage(
      `☑️ Đã bật antispam: Kick nếu gửi > ${count} tin nhắn trong vòng ${time}ms`,
      threadID,
      messageID
    )
  }

  const num = body.trim()
  switch (num) {
    case '1': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      const idx = dataAnti.boxname.findIndex((item) => item.threadID === threadID)
      if (idx !== -1) {
        dataAnti.boxname.splice(idx, 1)
        api.sendMessage('☑️ Tắt thành công anti đổi tên box', threadID, messageID)
      } else {
        const threadName = (await api.getThreadInfo(threadID)).threadName
        dataAnti.boxname.push({ threadID, name: threadName })
        api.sendMessage('☑️ Bật thành công anti đổi tên box', threadID, messageID)
      }
      saveData(dataAnti)
      break
    }
    case '2': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      const idx = dataAnti.boximage.findIndex((item) => item.threadID === threadID)
      if (idx !== -1) {
        dataAnti.boximage.splice(idx, 1)
        api.sendMessage('☑️ Tắt thành công anti đổi ảnh box', threadID, messageID)
      } else {
        const threadInfo = await api.getThreadInfo(threadID)
        dataAnti.boximage.push({ threadID, url: threadInfo.imageSrc })
        api.sendMessage('☑️ Bật thành công anti đổi ảnh box', threadID, messageID)
      }
      saveData(dataAnti)
      break
    }
    case '3': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      const idx = dataAnti.antiNickname.findIndex((item) => item.threadID === threadID)
      if (idx !== -1) {
        dataAnti.antiNickname.splice(idx, 1)
        api.sendMessage('☑️ Tắt thành công anti đổi biệt danh', threadID, messageID)
      } else {
        const nickNames = (await api.getThreadInfo(threadID)).nicknames
        dataAnti.antiNickname.push({ threadID, data: nickNames })
        api.sendMessage('☑️ Bật thành công anti đổi biệt danh', threadID, messageID)
      }
      saveData(dataAnti)
      break
    }
    case '4': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      dataAnti.antiout[threadID] = !dataAnti.antiout[threadID]
      api.sendMessage(
        `☑️ ${dataAnti.antiout[threadID] ? 'Bật' : 'Tắt'} thành công anti out`,
        threadID,
        messageID
      )
      saveData(dataAnti)
      break
    }
    case '5': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      if (!dataAnti.antiemoji) dataAnti.antiemoji = {}
      if (!dataAnti.antiemoji[threadID]?.enabled) {
        const emoji = (await api.getThreadInfo(threadID)).emoji
        dataAnti.antiemoji[threadID] = { emoji: emoji, enabled: true }
      } else {
        dataAnti.antiemoji[threadID].enabled = false
      }
      api.sendMessage(
        `☑️ ${dataAnti.antiemoji[threadID].enabled ? 'Bật' : 'Tắt'} thành công anti emoji`,
        threadID,
        messageID
      )
      saveData(dataAnti)
      break
    }
    case '6': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      if (!dataAnti.antitheme) dataAnti.antitheme = {}
      if (!dataAnti.antitheme[threadID]?.enabled) {
        let theme = ''
        try {
          theme = (await Threads.getInfo(threadID)).threadTheme.id
        } catch (_e) {}
        dataAnti.antitheme[threadID] = { themeid: theme, enabled: true }
      } else {
        dataAnti.antitheme[threadID].enabled = false
      }
      api.sendMessage(
        `☑️ ${dataAnti.antitheme[threadID].enabled ? 'Bật' : 'Tắt'} thành công anti theme`,
        threadID,
        messageID
      )
      saveData(dataAnti)
      break
    }
    case '7': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      if (!dataAnti.antiqtv) dataAnti.antiqtv = {}
      dataAnti.antiqtv[threadID] = !dataAnti.antiqtv[threadID]
      api.sendMessage(
        `☑️ ${dataAnti.antiqtv[threadID] ? 'Bật' : 'Tắt'} thành công anti qtv`,
        threadID,
        messageID
      )
      saveData(dataAnti)
      break
    }
    case '8': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      if (!dataAnti.antijoin) dataAnti.antijoin = {}
      dataAnti.antijoin[threadID] = !dataAnti.antijoin[threadID]
      api.sendMessage(
        `☑️ ${dataAnti.antijoin[threadID] ? 'Bật' : 'Tắt'} thành công anti join (chống thành viên mới)`,
        threadID,
        messageID
      )
      saveData(dataAnti)
      break
    }
    case '9': {
      if (permssion < 1) return api.sendMessage('⚠️ Không đủ quyền hạn', threadID, messageID)
      if (!dataAnti.antispam) dataAnti.antispam = {}
      if (dataAnti.antispam[threadID]?.enabled) {
        dataAnti.antispam[threadID].enabled = false
        saveData(dataAnti)
        return api.sendMessage('☑️ Tắt thành công chế độ antispam.', threadID, messageID)
      } else {
        return api.sendMessage(
          '📥 Vui lòng nhập số lượng tin nhắn và thời gian giới hạn (ms)!\nVí dụ: 6 5000 (Kick nếu chat > 6 tin / 5 giây)',
          threadID,
          (_err, info) => {
            global.client.handleReply.push({
              name: exports.config.name,
              messageID: info.messageID,
              author: senderID,
              permssion,
              action: 'spam_config',
            })
          },
          messageID
        )
      }
    }
    case '10': {
      const db = loadData()
      let msg = `[ CHECK CURRENT ANTI STATUS ]\n────────────────────\n`
      msg += `|› 1. Namebox: ${db.boxname.find((i) => i.threadID === threadID) ? 'Bật' : 'Tắt'}\n`
      msg += `|› 2. Imagebox: ${db.boximage.find((i) => i.threadID === threadID) ? 'Bật' : 'Tắt'}\n`
      msg += `|› 3. Nickname: ${db.antiNickname.find((i) => i.threadID === threadID) ? 'Bật' : 'Tắt'}\n`
      msg += `|› 4. Anti-Out: ${db.antiout?.[threadID] ? 'Bật' : 'Tắt'}\n`
      msg += `|› 5. Anti-Emoji: ${db.antiemoji?.[threadID]?.enabled ? 'Bật' : 'Tắt'}\n`
      msg += `|› 6. Anti-Theme: ${db.antitheme?.[threadID]?.enabled ? 'Bật' : 'Tắt'}\n`
      msg += `|› 7. Anti-QTV: ${db.antiqtv?.[threadID] ? 'Bật' : 'Tắt'}\n`
      msg += `|› 8. Anti-Join: ${db.antijoin?.[threadID] ? 'Bật' : 'Tắt'}\n`
      msg += `|› 9. Anti-Spam: ${db.antispam?.[threadID]?.enabled ? `Bật (${db.antispam[threadID].spamCount} tin/${db.antispam[threadID].spamTime}ms)` : 'Tắt'}\n`
      msg += `────────────────────\n|› Reply số tương ứng để thay đổi!`
      return api.sendMessage(msg, threadID, messageID)
    }
    default: {
      return api.sendMessage(`❎ Lựa chọn không hợp lệ!`, threadID, messageID)
    }
  }
}

module.exports.run = async ({ api, event, permssion }) => {
  const { threadID, messageID, senderID } = event

  return api.sendMessage(
    `╭─────────────⭓\n│ HỆ THỐNG KIỂM SOÁT NHÓM\n├─────⭔\n│ 1. anti namebox: cấm đổi tên nhóm\n│ 2. anti boximage: cấm đổi ảnh nhóm\n│ 3. anti nickname: cấm đổi biệt danh user\n│ 4. anti out: cấm thành viên out chùa\n│ 5. anti emoji: cấm thay đổi emoji nhóm\n│ 6. anti theme: cấm thay đổi chủ đề nhóm\n│ 7. anti qtv: cấm thay đổi qtv nhóm\n│ 8. anti join: cấm thêm thành viên vào nhóm\n│ 9. anti spam: kick người lạ auto spam\n│ 10. Check trạng thái bật/tắt toàn bộ anti\n├────────⭔\n│ 📌 Reply (phản hồi) theo stt để bật/tắt chế độ\n╰─────────────⭓`,
    threadID,
    (error, info) => {
      if (!error) {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          permssion,
        })
      }
    },
    messageID
  )
}
