module.exports.config = {
  name: 'refresh',
  version: '2.1.0',
  hasPermssion: 1,
  credits: 'ReU',
  description: 'Làm mới data nhóm',
  commandCategory: 'Nhóm',
  usages: '[để trống hoặc nhập ID nhóm]',
  cooldowns: 5,
}

module.exports.run = async ({ event, args, api, Threads }) => {
  const { threadID, messageID } = event
  const targetID = args[0] || threadID

  try {
    const threadInfo = await api.getThreadInfo(targetID)

    if (
      !threadInfo ||
      threadInfo.__status === 'unavailable' ||
      threadInfo.__status === 'cooldown' ||
      !threadInfo.participantIDs?.length
    ) {
      return api.sendMessage(
        '❌ Không thể lấy thông tin nhóm này.\n💡 Mẹo: Hãy đảm bảo nhóm có tin nhắn gần đây, bot là thành viên và thử lại sau 5 phút nếu bị cooldown.',
        threadID,
        messageID
      )
    }

    const threadName = threadInfo.threadName || threadInfo.name || 'Không tên'
    const qtv = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs.length : 0
    const participantCount = threadInfo.participantIDs.length

    await Threads.setData(targetID, { threadInfo })

    return api.sendMessage(
      `✅ Đã làm mới data nhóm thành công!\n━━━━━━━━━━━\n👨‍💻 Tên nhóm: ${threadName}\n🔎 ID: ${targetID}\n👥 Thành viên: ${participantCount}\n📌 Quản trị viên: ${qtv} người`,
      threadID,
      messageID
    )
  } catch (error) {
    console.error('[REFRESH ERROR]', error)
    return api.sendMessage(
      `❌ Lỗi hệ thống: ${error.message || 'Lỗi không xác định'}\n💡 Thử lại sau hoặc kiểm tra quyền bot.`,
      threadID,
      messageID
    )
  }
}
