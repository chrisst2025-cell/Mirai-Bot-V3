const moment = require('moment-timezone')

module.exports.config = {
  name: 'money',
  version: '1.2.0',
  hasPermssion: 0,
  credits: 'Quất & G3K Optimizer',
  description: 'Quản lý tiền tệ: Check, Set, Pay, Tính toán (Admin)',
  commandCategory: 'Coin',
  usages: '[+/-/*/ / / ++/ --/ +-/ ^/ √/ +%/ -%/ pay] [số tiền]',
  cooldowns: 2,
  usePrefix: false,
}

const toStoredMoney = (value) =>
  value === Infinity ? Infinity : Number.isFinite(value) ? Math.trunc(value) : 0

module.exports.run = async ({ Currencies, api, event, args, Users, permssion }) => {
  const { senderID, mentions, type, messageReply, threadID } = event
  const time = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss - DD/MM/YYYY')
  const targetID =
    type === 'message_reply' ? messageReply.senderID : (Object.keys(mentions ?? {})[0] ?? senderID)

  try {
    const name = await Users.getNameUser(targetID)
    const { money: currentMoney = 0 } = (await Currencies.getData(targetID)) ?? {}

    if (!args[0])
      return api.sendMessage(
        currentMoney === Infinity
          ? `${name} có vô hạn tiền`
          : `${name} hiện đang có ${currentMoney}$`,
        threadID
      )

    if (args[0] === 'pay') {
      if (targetID === senderID)
        return api.sendMessage('❌ Không thể chuyển tiền cho chính mình!', threadID)
      const { money: senderMoney = 0 } = (await Currencies.getData(senderID)) ?? {}
      const bet = args[1] === 'all' ? senderMoney : parseInt(args[1], 10)
      if (Number.isNaN(bet) || bet <= 0 || senderMoney < bet)
        return api.sendMessage('Số tiền chuyển không hợp lệ hoặc bạn không đủ số dư!', threadID)
      await Currencies.decreaseMoney(senderID, bet)
      await Currencies.increaseMoney(targetID, bet)
      return api.sendMessage(`✅ Đã chuyển cho ${name} ${bet}$`, threadID)
    }

    if (permssion < 2)
      return api.sendMessage('⚠️ Bạn không đủ quyền hạn để thực thi lệnh này.', threadID)

    const val = parseFloat(args[1])
    if (!['++', '--'].includes(args[0]) && Number.isNaN(val))
      return api.sendMessage('❌ Vui lòng nhập số tiền hợp lệ!', threadID)
    if ((args[0] === '/' || args[0] === '√') && val === 0)
      return api.sendMessage('❌ Không thể chia cho 0!', threadID)

    const actions = {
      '+': () => [currentMoney + val, `được cộng thêm ${val}$`],
      '-': () => [currentMoney - val, `bị trừ đi ${val}$`],
      '*': () => [currentMoney * val, `được nhân lên ${val} lần`],
      '/': () => [currentMoney / val, `bị chia đi ${val} lần`],
      '++': () => [Infinity, 'được thay đổi thành vô hạn'],
      '--': () => [0, 'bị reset về 0'],
      '+-': () => [val, `được thay đổi thành ${val}$`],
      '^': () => [currentMoney ** val, `được lũy thừa bậc ${val}`],
      '√': () => [currentMoney ** (1 / val), `được căn bậc ${val}`],
      '+%': () => {
        const percent = (currentMoney * val) / 100
        return [currentMoney + percent, `được cộng thêm ${val}% (${percent}$)`]
      },
      '-%': () => {
        const percent = (currentMoney * val) / 100
        return [currentMoney - percent, `bị trừ đi ${val}% (${percent}$)`]
      },
    }

    const result = actions[args[0]]?.()
    if (!result) return api.sendMessage('❌ Lệnh không hợp lệ!', threadID)

    const [newMoney, actionText] = result
    await Currencies.setData(targetID, { money: toStoredMoney(newMoney) })

    return api.sendMessage(
      `💸 Money của ${name} ${actionText}\n💸 Số dư mới: ${newMoney === Infinity ? '∞' : newMoney}$\n⏰ Thời gian: ${time}`,
      threadID
    )
  } catch (e) {
    console.error(e)
    return api.sendMessage('🔥 Đã xảy ra lỗi hệ thống khi xử lý lệnh.', threadID)
  }
}
