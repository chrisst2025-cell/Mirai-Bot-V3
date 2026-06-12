// <===> modules/events/anti.js <===//
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
  ],
  version: '2.0.0',
  credits: 'System',
  description: 'Anti Handler (Unified)',
}

const { readFileSync } = require('fs-extra')
const path = require('node:path')

module.exports.run = async ({ event, api }) => {
  const { threadID, logMessageType, logMessageData } = event

  const antiPath = path.join(__dirname, '..', 'commands', 'data', 'config', 'anti.json')

  let dataAnti
  try {
    dataAnti = JSON.parse(readFileSync(antiPath, 'utf8'))
  } catch {
    return // System not configured or ready
  }

  const { boxname, boximage, antiout, antiemoji, antitheme, antiqtv, antijoin } = dataAnti

  switch (logMessageType) {
    case 'log:thread-name': {
      const nameItem = (boxname || []).find((item) => item.threadID === threadID)
      if (nameItem) {
        api.setTitle(nameItem.name, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi tên nhóm! Đã khôi phục tên cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-image': {
      const imageItem = (boximage || []).find((item) => item.threadID === threadID)
      if (imageItem) {
        const axios = require('axios')
        const { pipeline } = require('node:stream/promises')
        const fs = require('node:fs')
        try {
          const tempPath = path.join(
            __dirname,
            '..',
            'commands',
            'cache',
            `temp_anti_${threadID}.jpg`
          )
          const response = await axios.get(imageItem.url, { responseType: 'stream' })
          await pipeline(response.data, fs.createWriteStream(tempPath))
          api.changeGroupImage(fs.createReadStream(tempPath), threadID, () => {
            fs.unlink(tempPath, () => {})
            api.sendMessage('🚫 Phát hiện đổi ảnh nhóm! Đã khôi phục ảnh cũ.', threadID)
          })
        } catch (_err) {}
      }
      break
    }
    case 'log:thread-icon': {
      if (antiemoji?.[threadID]?.enabled) {
        api.changeThreadEmoji(antiemoji[threadID].emoji, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi emoji nhóm! Đã khôi phục emoji cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-color': {
      if (antitheme?.[threadID]?.enabled) {
        api.changeThreadColor(antitheme[threadID].themeid, threadID, () => {
          api.sendMessage('🚫 Phát hiện đổi chủ đề nhóm! Đã khôi phục chủ đề cũ.', threadID)
        })
      }
      break
    }
    case 'log:thread-admins': {
      if (antiqtv?.[threadID]) {
        api.sendMessage(
          '🚫 Phát hiện sửa đổi QTV nhóm! (Hệ thống chống cướp box đã được ghi nhận)',
          threadID
        )
      }
      break
    }
    case 'log:unsubscribe': {
      if (antiout?.[threadID]) {
        const leftUserId = logMessageData.leftParticipantFbId
        api.addUserToGroup(leftUserId, threadID, () => {
          if (leftUserId !== api.getCurrentUserID()) {
            api.sendMessage(
              '🚫 Người dùng không được phép tự ý out! Đã cưỡng chế thêm lại.',
              threadID
            )
          }
        })
      }
      break
    }
    case 'log:subscribe': {
      if (antijoin?.[threadID]) {
        const joinedUsers = logMessageData.addedParticipants || []
        for (const user of joinedUsers) {
          if (user.userFbId !== api.getCurrentUserID()) {
            api.removeUserFromGroup(user.userFbId, threadID, () => {
              api.sendMessage(
                '🚫 Chế độ ANTI-JOIN đang bật! Đã kick thành viên vừa lọt vào nhóm.',
                threadID
              )
            })
          }
        }
      }
      break
    }
  }
}
