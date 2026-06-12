module.exports.config = {
  name: 'idbox',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'System',
  description: 'Lấy ID nhóm chat và người dùng',
  commandCategory: 'Nhóm',
  usages: 'idbox [@tag]',
  cooldowns: 3,
}
module.exports.run = async ({ api, event }) => {
  const { threadID, senderID, mentions } = event
  const uid = Object.keys(mentions)[0] || senderID
  api.sendMessage(
    `📌 ID Nhóm: ${threadID}\n👤 ID ${Object.keys(mentions).length ? 'người được tag' : 'bạn'}: ${uid}`,
    threadID,
    event.messageID
  )
}
