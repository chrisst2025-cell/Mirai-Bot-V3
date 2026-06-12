module.exports.config = {
  name: 'echo',
  version: '1.0.0',
  hasPermssion: 1,
  credits: 'System',
  description: 'Gửi lại tin nhắn bất kỳ',
  commandCategory: 'Tiện ích',
  usages: 'echo <nội dung>',
  cooldowns: 2,
}
module.exports.run = async ({ api, event, args }) => {
  if (!args[0]) return api.sendMessage('❌ Nhập nội dung cần gửi!', event.threadID, event.messageID)
  api.sendMessage(args.join(' '), event.threadID, event.messageID)
}
