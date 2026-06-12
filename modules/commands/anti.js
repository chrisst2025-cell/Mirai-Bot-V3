const { readFileSync, writeFileSync } = require('fs-extra')
const path = require('node:path')
const fs = require('node:fs')
const _axios = require('axios')

module.exports.config = {
  name: 'anti',
  version: '4.1.5',
  hasPermssion: 1,
  credits: 'BraSL mod by G3K',
  description: 'Anti change Box chat vip pro',
  commandCategory: 'Nhóm',
  usages: 'anti dùng để bật tắt',
  cooldowns: 5,
  images: [],
  dependencies: {
    'fs-extra': '',
  },
}

module.exports.handleReply = async ({ api, event, handleReply, Threads }) => {
  const { senderID, threadID, messageID } = event
  const { author, permssion } = handleReply
  const pathData = path.join(__dirname, 'data', 'anti.json')
  let dataAnti
  try {
    dataAnti = JSON.parse(readFileSync(pathData, 'utf8'))
  } catch {
    dataAnti = {
      boxname: [],
      boximage: [],
      antiNickname: [],
      antiout: {},
      antijoin: {},
    }
    writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
  }
  if (!dataAnti.antijoin) dataAnti.antijoin = {}
  let NameBox, threadName, threadInfo

  if (author !== senderID) return api.sendMessage('❎ Bạn không phải người dùng lệnh', threadID)

  const number = event.body
    .split(/\s+/)
    .map((i) => Number.parseInt(i, 10))
    .filter((i) => !Number.isNaN(i))
    .map(String)
  for (const num of number) {
    switch (num) {
      case '1': {
        if (permssion < 1)
          return api.sendMessage(
            '⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này',
            threadID,
            messageID
          )
        NameBox = dataAnti.boxname
        const antiImage = NameBox.find((item) => item.threadID === threadID)
        if (antiImage) {
          dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID)
          api.sendMessage('☑️ Tắt thành công chế độ anti đổi tên box ', threadID, messageID)
        } else {
          threadName = (await api.getThreadInfo(event.threadID)).threadName
          dataAnti.boxname.push({
            threadID,
            name: threadName,
          })
          api.sendMessage('☑️ Bật thành công chế độ anti đổi tên box', threadID, messageID)
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
        break
      }
      case '2': {
        if (permssion < 1)
          return api.sendMessage(
            '⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này',
            threadID,
            messageID
          )
        const antiImage = dataAnti.boximage.find((item) => item.threadID === threadID)
        if (antiImage) {
          dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID)
          api.sendMessage('☑️ Tắt thành công chế độ anti đổi ảnh box', threadID, messageID)
        } else {
          threadInfo = await api.getThreadInfo(event.threadID)
          const url = threadInfo.imageSrc
          dataAnti.boximage.push({
            threadID,
            url: url,
          })
          api.sendMessage('☑️ Bật thành công chế độ anti đổi ảnh box', threadID, messageID)
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
        break
      }
      case '3': {
        if (permssion < 1)
          return api.sendMessage(
            '⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này',
            threadID,
            messageID
          )
        const NickName = dataAnti.antiNickname.find((item) => item.threadID === threadID)

        if (NickName) {
          dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID)
          api.sendMessage('☑️ Tắt thành công chế độ anti đổi biệt danh', threadID, messageID)
        } else {
          const nickName = (await api.getThreadInfo(event.threadID)).nicknames
          dataAnti.antiNickname.push({
            threadID,
            data: nickName,
          })
          api.sendMessage('☑️ Bật thành công chế độ anti đổi biệt danh', threadID, messageID)
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
        break
      }
      case '4': {
        if (permssion < 1)
          return api.sendMessage(
            '⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này',
            threadID,
            messageID
          )
        const antiout = dataAnti.antiout
        if (antiout[threadID] === true) {
          antiout[threadID] = false
          api.sendMessage('☑️ Tắt thành công chế độ anti out', threadID, messageID)
        } else {
          antiout[threadID] = true
          api.sendMessage('☑️ Bật thành công chế độ anti out', threadID, messageID)
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
        break
      }
      case '5': {
        const filepath = path.join(__dirname, 'data', 'antiemoji.json')
        let data
        try {
          data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        } catch {
          data = {}
        }
        let emoji = ''
        try {
          const threadInfo = await api.getThreadInfo(threadID)
          emoji = threadInfo.emoji
        } catch (error) {
          console.error(error)
        }
        if (!Object.hasOwn(data, threadID)) {
          data[threadID] = {
            emoji: emoji,
            emojiEnabled: true,
          }
        } else {
          data[threadID].emojiEnabled = !data[threadID].emojiEnabled
          if (data[threadID].emojiEnabled) {
            data[threadID].emoji = emoji
          }
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
        const statusMessage = data[threadID].emojiEnabled ? 'Bật' : 'Tắt'
        api.sendMessage(`☑️ ${statusMessage} thành công chế độ anti emoji`, threadID, messageID)
        break
      }
      case '6': {
        const filepath = path.join(__dirname, 'data', 'antitheme.json')
        let data
        try {
          data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        } catch {
          data = {}
        }
        let theme = ''
        try {
          const threadInfo = await Threads.getInfo(threadID)
          theme = threadInfo.threadTheme.id
        } catch (error) {
          console.error(error)
        }
        if (!Object.hasOwn(data, threadID)) {
          data[threadID] = {
            themeid: theme || '',
            themeEnabled: true,
          }
        } else {
          data[threadID].themeEnabled = !data[threadID].themeEnabled
          if (data[threadID].themeEnabled) {
            data[threadID].themeid = theme || ''
          }
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
        const statusMessage = data[threadID].themeEnabled ? 'Bật' : 'Tắt'
        api.sendMessage(`☑️ ${statusMessage} thành công chế độ anti theme`, threadID, messageID)
        break
      }
      case '7': {
        const dataAntiPath = path.join(__dirname, 'data', 'antiqtv.json')
        const info = await api.getThreadInfo(event.threadID)
        if (!info.adminIDs.some((item) => item.id === api.getCurrentUserID()))
          return api.sendMessage(
            '❎ Bot cần quyền quản trị viên để có thể thực thi lệnh',
            event.threadID,
            event.messageID
          )
        let data
        try {
          data = JSON.parse(fs.readFileSync(dataAntiPath, 'utf8'))
        } catch {
          data = {}
        }
        const { threadID, messageID } = event
        if (!data[threadID]) {
          data[threadID] = true
          api.sendMessage(`☑️ Bật thành công chế độ anti qtv`, threadID, messageID)
        } else {
          data[threadID] = false
          api.sendMessage(`☑️ Tắt thành công chế độ anti qtv`, threadID, messageID)
        }
        fs.writeFileSync(dataAntiPath, JSON.stringify(data, null, 4))
        break
      }
      case '8': {
        if (permssion < 1)
          return api.sendMessage(
            '⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này',
            threadID,
            messageID
          )
        const antijoin = dataAnti.antijoin || {}
        if (antijoin[threadID] === true) {
          antijoin[threadID] = false
          api.sendMessage('☑️ Tắt thành công chế độ anti join', threadID, messageID)
        } else {
          antijoin[threadID] = true
          api.sendMessage('☑️ Bật thành công chế độ anti join', threadID, messageID)
        }
        dataAnti.antijoin = antijoin
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4))
        break
      }
      case '9': {
        const antiImage = dataAnti.boximage.find((item) => item.threadID === threadID)
        const antiBoxname = dataAnti.boxname.find((item) => item.threadID === threadID)
        const antiNickname = dataAnti.antiNickname.find((item) => item.threadID === threadID)
        const antiOut = dataAnti.antiout?.[threadID] ? 'bật' : 'tắt'
        const antiJoin = dataAnti.antijoin?.[threadID] ? 'bật' : 'tắt'

        const filepathEmoji = path.join(__dirname, 'data', 'antiemoji.json')
        let dataEmoji = {}
        try {
          dataEmoji = JSON.parse(fs.readFileSync(filepathEmoji, 'utf8'))
        } catch {}
        const antiEmoji = dataEmoji[threadID]?.emojiEnabled ? 'bật' : 'tắt'

        const filepathTheme = path.join(__dirname, 'data', 'antitheme.json')
        let dataTheme = {}
        try {
          dataTheme = JSON.parse(fs.readFileSync(filepathTheme, 'utf8'))
        } catch {}
        const antiTheme = dataTheme[threadID]?.themeEnabled ? 'bật' : 'tắt'

        const filepathQtv = path.join(__dirname, 'data', 'antiqtv.json')
        let dataQtv = {}
        try {
          dataQtv = JSON.parse(fs.readFileSync(filepathQtv, 'utf8'))
        } catch {}
        const antiQtv = dataQtv[threadID] ? 'bật' : 'tắt'

        return api.sendMessage(
          `[ CHECK ANTI BOX ]\n────────────────────\n|› 1. anti namebox: ${antiBoxname ? 'bật' : 'tắt'}\n|› 2. anti boximage: ${antiImage ? 'bật' : 'tắt'}\n|› 3. anti nickname: ${antiNickname ? 'bật' : 'tắt'}\n|› 4. anti out: ${antiOut}\n|› 5. anti emoji: ${antiEmoji}\n|› 6. anti theme: ${antiTheme}\n|› 7. anti qtv: ${antiQtv}\n|› 8. anti join: ${antiJoin}\n────────────────────\n|› Trên kia là trạng thái các chức năng anti của nhóm`,
          threadID
        )
      }
      default: {
        return api.sendMessage('❎ Số bạn chọn không có trong lệnh', threadID)
      }
    }
  }
}

module.exports.run = async ({ api, event, permssion }) => {
  const { threadID, messageID, senderID } = event
  return api.sendMessage(
    `╭─────────────⭓\n│ Anti Change Info Group\n├─────⭔\n│ 1. anti namebox: cấm đổi tên nhóm\n│ 2. anti boximage: cấm đổi ảnh nhóm\n│ 3. anti nickname: cấm đổi biệt danh người dùng\n│ 4. anti out: cấm thành viên out chùa\n│ 5. anti emoji: cấm thay đổi emoji nhóm\n│ 6. anti theme: cấm thay đổi chủ đề nhóm\n│ 7. anti qtv: cấm thay qtv nhóm (tránh bị cướp box)\n│ 8. anti join: cấm thêm thành viên mới vào nhóm\n│ 9. check trạng thái anti của nhóm\n├────────⭔\n│ 📌 Reply (phản hồi) theo stt để chọn chế độ mà bạn muốn thay đổi trạng thái\n╰─────────────⭓`,
    threadID,
    (error, info) => {
      if (error) {
        return api.sendMessage('❎ Đã xảy ra lỗi!', threadID)
      } else {
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
