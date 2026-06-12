module.exports.config = {
  name: 'random',
  version: '1.0.1',
  hasPermission: 1,
  credits: 'TatsuYTB',
  description: 'Random số',
  commandCategory: 'Tiện ích',
  usages: 'random [số thấp nhất] [số cao nhất]',
  cooldowns: 0,
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event
  const min = parseInt(args[0], 10)
  const max = parseInt(args[1], 10)

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return api.sendMessage('Vui lòng nhập số thấp nhất và số cao nhất hợp lệ.', threadID, messageID)
  }

  if (min >= max) {
    return api.sendMessage('Số thấp nhất phải nhỏ hơn số cao nhất.', threadID, messageID)
  }

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return api.sendMessage(`Kết quả: ${randomNumber}`, threadID, messageID)
}
