module.exports.config = {
  name: 'getlink',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'System',
  description: 'Lấy link tải từ file đính kèm',
  commandCategory: 'Tiện ích',
  usages: 'getlink (reply vào tin nhắn có file)',
  cooldowns: 3,
}
module.exports.run = async ({ api, event }) => {
  const msg = event.messageReply
  if (!msg?.attachments?.length)
    return api.sendMessage('❌ Reply vào tin nhắn có đính kèm!', event.threadID, event.messageID)
  const links = msg.attachments
    .map((a, i) => `${i + 1}. [${a.type}] ${a.url || a.previewUrl || 'N/A'}`)
    .join('\n')
  api.sendMessage(`🔗 Link đính kèm:\n${links}`, event.threadID, event.messageID)
}
