module.exports.config = {
  name: 'uidall',
  version: '1.0.0',
  hasPermssion: 1,
  credits: 'System',
  description: 'Lấy UID tất cả thành viên trong nhóm',
  commandCategory: 'Thống kê',
  usages: 'uidall',
  cooldowns: 10,
}
module.exports.run = async ({ api, event }) => {
  const info = await api.getThreadInfo(event.threadID)
  const members = info.userInfo.map((u) => `${u.name}: ${u.id}`).join('\n')
  api.sendMessage(
    `👥 Danh sách UID [${info.userInfo.length} thành viên]:\n${members}`,
    event.threadID,
    event.messageID
  )
}
