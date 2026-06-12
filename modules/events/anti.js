const { readFileSync } = require('fs-extra')
const path = require('node:path')
const fs = require('node:fs')

module.exports.config = {
  name: 'anti',
  eventType: [
    'log:thread-name',
    'log:thread-image',
    'log:thread-icon',
    'log:thread-color',
    'log:thread-admins',
    'log:unsubscribe',
    'log:subscribe',
    'log:user-nickname',
  ],
  version: '1.0.0',
  credits: 'BraSL',
  description: 'Anti change Box chat - Event Handler',
}

module.exports.run = async ({ event, api }) => {
  const { threadID, logMessageType, logMessageData } = event

  const antiPath = path.join(__dirname, '..', 'commands', 'data', 'anti.json')
  const emojiPath = path.join(__dirname, '..', 'commands', 'data', 'antiemoji.json')
  const themePath = path.join(__dirname, '..', 'commands', 'data', 'antitheme.json')
  const qtvPath = path.join(__dirname, '..', 'commands', 'data', 'antiqtv.json')

  let dataAnti
  try {
    dataAnti = JSON.parse(readFileSync(antiPath, 'utf8'))
  } catch {
    dataAnti = { boxname: [], boximage: [], antiNickname: [], antiout: {}, antijoin: {} }
  }
  if (!Array.isArray(dataAnti.boxname)) dataAnti.boxname = []
  if (!Array.isArray(dataAnti.boximage)) dataAnti.boximage = []
  if (!Array.isArray(dataAnti.antiNickname)) dataAnti.antiNickname = []
  if (typeof dataAnti.antiout !== 'object' || dataAnti.antiout === null) dataAnti.antiout = {}
  if (typeof dataAnti.antijoin !== 'object' || dataAnti.antijoin === null) dataAnti.antijoin = {}

  let emojiData
  try {
    emojiData = JSON.parse(fs.readFileSync(emojiPath, 'utf8'))
  } catch {
    emojiData = {}
  }

  let themeData
  try {
    themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'))
  } catch {
    themeData = {}
  }

  let qtvData
  try {
    qtvData = JSON.parse(fs.readFileSync(qtvPath, 'utf8'))
  } catch {
    qtvData = {}
  }

  switch (logMessageType) {
    case 'log:thread-name': {
      const nameItem = dataAnti.boxname.find((item) => item.threadID === threadID)
      if (nameItem) {
        api.setTitle(nameItem.name, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi tên nhóm! Đã khôi phục tên cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-image': {
      const imageItem = dataAnti.boximage.find((item) => item.threadID === threadID)
      if (imageItem) {
        const axios = require('axios')
        const { pipeline } = require('node:stream/promises')
        const fs = require('node:fs')
        const tempPath = path.join(__dirname, '..', 'commands', 'cache', `temp_${threadID}.jpg`)
        try {
          const response = await axios.get(imageItem.url, { responseType: 'stream' })
          await pipeline(response.data, fs.createWriteStream(tempPath))
          api.changeGroupImage(fs.createReadStream(tempPath), threadID, () => {
            fs.unlink(tempPath, () => {})
            api.sendMessage('🚫 Phát hiện đổi ảnh nhóm! Đã khôi phục ảnh cũ.', threadID)
          })
        } catch (err) {
          console.error(err)
        }
      }
      break
    }
    case 'log:thread-icon': {
      if (emojiData[threadID]?.emojiEnabled) {
        api.changeThreadEmoji(emojiData[threadID].emoji, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi emoji nhóm! Đã khôi phục emoji cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-color': {
      if (themeData[threadID]?.themeEnabled) {
        api.changeThreadColor(themeData[threadID].themeid, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi chủ đề nhóm! Đã khôi phục chủ đề cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-admins': {
      if (qtvData[threadID]) {
        const { TARGET_ID, ADMIN_EVENT } = logMessageData
        if (ADMIN_EVENT === 'add_admin') {
          api.changeAdminStatus(threadID, TARGET_ID, false, (err) => {
            if (err) return console.error(err)
            api.sendMessage(
              '🚫 Nhóm đang bật anti QTV! Đã hủy quyền quản trị viên vừa thêm.',
              threadID
            )
          })
        } else if (ADMIN_EVENT === 'remove_admin') {
          api.changeAdminStatus(threadID, TARGET_ID, true, (err) => {
            if (err) return console.error(err)
            api.sendMessage(
              '🚫 Nhóm đang bật anti QTV! Đã khôi phục quyền quản trị viên.',
              threadID
            )
          })
        }
      }
      break
    }
    case 'log:unsubscribe': {
      if (dataAnti.antiout[threadID]) {
        const leftUserId = logMessageData.leftParticipantFbId
        api.addUserToGroup(leftUserId, threadID, () => {
          api.sendMessage(
            `🚫 ${logMessageData.leftParticipantFbId} đã out nhóm! Đã thêm lại.`,
            threadID
          )
        })
      }
      break
    }
    case 'log:subscribe': {
      if (dataAnti.antijoin[threadID]) {
        const addedParticipants = logMessageData.addedParticipants
        for (const participant of addedParticipants) {
          const userID = participant.userFbId
          if (userID !== api.getCurrentUserID()) {
            api.removeUserFromGroup(userID, threadID, (err) => {
              if (err) return console.error(err)
              api.sendMessage(
                '🚫 Nhóm đang bật anti join! Đã tự động kick thành viên mới.',
                threadID
              )
            })
          }
        }
      }
      break
    }
    case 'log:user-nickname': {
      const nicknameItem = dataAnti.antiNickname.find((item) => item.threadID === threadID)
      if (nicknameItem) {
        const participantID = logMessageData.participant_id
        const oldNickname = nicknameItem.data[participantID] || ''
        api.changeNickname(oldNickname, threadID, participantID, (err) => {
          if (err) return console.error(err)
          api.sendMessage('🚫 Nhóm đang bật anti biệt danh! Đã khôi phục biệt danh cũ.', threadID)
        })
      }
      break
    }
  }
}
