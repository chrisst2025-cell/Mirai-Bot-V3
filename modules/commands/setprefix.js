module.exports.config = {
  name: 'setprefix',
  version: '2.0.33',
  hasPermssion: 1,
  credits: 'BraSL mod by G3K',
  description: 'Đặt lại prefix của nhóm',
  commandCategory: 'Nhóm',
  usages: '[prefix/reset]',
  cooldowns: 10,
}

module.exports.run = async ({ api, event, args, Threads }) => {
  const { threadID, messageID, senderID } = event
  const prefix = args[0]?.trim()

  if (!prefix) {
    return api.sendMessage('❎ Prefix không được để trống!', threadID, messageID)
  }

  if (prefix.toLowerCase() === 'reset') {
    try {
      const threadData = (await Threads.getData(threadID)).data || {}
      delete threadData.PREFIX
      await Threads.setData(threadID, { data: threadData })

      if (global.data?.threadData) {
        global.data.threadData.set(String(threadID), threadData)
      }

      return api.sendMessage(
        `✅ Đã reset prefix về mặc định: ${global.config.PREFIX}`,
        threadID,
        async (err) => {
          if (!err) {
            const botID = api.getCurrentUserID()
            await api.changeNickname(
              `『${global.config.PREFIX}』• ${global.config.BOTNAME}`,
              threadID,
              botID
            )
          }
        },
        messageID
      )
    } catch (e) {
      console.error(e)
      return api.sendMessage(`❎ Đã có lỗi xảy ra: ${e.message}`, threadID, messageID)
    }
  }

  api.sendMessage(
    `📌 Thả cảm xúc vào tin nhắn này để xác nhận đổi prefix thành: ${prefix}`,
    threadID,
    (err, info) => {
      if (!err) {
        global.client.handleReaction.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          prefix: prefix,
        })
      }
    },
    messageID
  )
}

module.exports.handleReaction = async ({ api, event, handleReaction, Threads }) => {
  const { threadID, messageID, userID } = event
  if (userID !== handleReaction.author) return

  const prefix = handleReaction.prefix

  try {
    const threadData = (await Threads.getData(threadID)).data || {}
    threadData.PREFIX = prefix
    await Threads.setData(threadID, { data: threadData })

    if (global.data?.threadData) {
      global.data.threadData.set(String(threadID), threadData)
    }

    api.sendMessage(
      `✅ Prefix của nhóm đã được đổi thành: ${prefix}`,
      threadID,
      async (err) => {
        if (!err) {
          const botID = api.getCurrentUserID()
          await api.changeNickname(`『${prefix}』• ${global.config.BOTNAME}`, threadID, botID)
        }
      },
      messageID
    )

    const indexOfHandle = global.client.handleReaction.findIndex((e) => e.messageID === messageID)
    if (indexOfHandle !== -1) global.client.handleReaction.splice(indexOfHandle, 1)
  } catch (e) {
    console.error(e)
    return api.sendMessage(
      `❎ Đã có lỗi xảy ra khi thay đổi prefix: ${e.message}`,
      threadID,
      messageID
    )
  }
}

module.exports.handleEvent = async ({ api, event, Threads }) => {
  if (event.body?.toLowerCase() !== 'prefix') return
  const { threadID, messageID } = event

  try {
    const threadData = (await Threads.getData(threadID)).data || {}
    const prefix = threadData.PREFIX || global.config.PREFIX

    if (global.prefixCache) {
      global.prefixCache[threadID] = prefix
    }

    api.sendMessage(
      `📎 Prefix hệ thống: ${global.config.PREFIX}\n✏️ Prefix nhóm của bạn: ${prefix}`,
      threadID,
      messageID
    )
  } catch (e) {
    console.error(e)
    api.sendMessage('❎ Không thể lấy prefix của nhóm này!', threadID, messageID)
  }
}
