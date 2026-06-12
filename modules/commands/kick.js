module.exports.config = {
  name: 'kick',
  version: '1.0.0',
  hasPermssion: 1,
  credits: 'D-Jukie',
  description: 'Xoá người bạn cần xoá khỏi nhóm bằng cách tag hoặc reply',
  commandCategory: 'Nhóm',
  usages: '[tag/reply/all]',
  cooldowns: 0,
}

module.exports.run = async ({ args, api, event, Threads }) => {
  var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo
  const botID = api.getCurrentUserID()
  try {
    if (args.join().indexOf('@') !== -1) {
      var mention = Object.keys(event.mentions)
      for (const o in mention) {
        setTimeout(() => {
          return api.removeUserFromGroup(mention[o], event.threadID)
        }, 1000)
      }
    } else {
      if (event.type === 'message_reply') {
        uid = event.messageReply.senderID
        return api.removeUserFromGroup(uid, event.threadID)
      } else {
        if (!args[0])
          return api.sendMessage(
            `Vui lòng tag hoặc reply người muốn kick, hoặc dùng kick all để rã box=))`,
            event.threadID,
            event.messageID
          )
        else {
          if (args[0] === 'all') {
            const listUserID = event.participantIDs.filter(
              (ID) => ID !== botID && ID !== event.senderID
            )
            for (const idUser in listUserID) {
              setTimeout(() => {
                return api.removeUserFromGroup(idUser, event.threadID)
              }, 1000)
            }
          }
        }
      }
    }
  } catch {
    return api.sendMessage('𝐁𝐚𝐢𝐁𝐚𝐢<3', event.threadID, event.messageID)
  }
}
