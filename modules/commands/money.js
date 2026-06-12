const moment = require('moment-timezone')

module.exports.config = {
  name: 'money',
  version: '1.2.0',
  hasPermssion: 0,
  credits: 'Quất mod by Vuiz',
  description: 'Quản lý tiền tệ: Check, Set, Pay, Tính toán (Admin)',
  commandCategory: 'Tiền tệ',
  usages: '[+/-/*/ / / ++/ --/ +-/ ^/ √/ +%/ -%/ pay] [số tiền]',
  cooldowns: 2,
  usePrefix: false,
}

module.exports.run = async ({ Currencies, api, event, args, Users, permssion }) => {
  const { senderID, mentions, type, messageReply, threadID } = event

  const targetID =
    type === 'message_reply' && messageReply
      ? messageReply.senderID
      : (Object.keys(mentions || {})[0] ?? senderID)

  try {
    const name = await Users.getNameUser(targetID)
    const currentMoney = (await Currencies.getData(targetID))?.money ?? 0

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
      const senderMoney = (await Currencies.getData(senderID))?.money ?? 0
      if (senderMoney === Infinity)
        return api.sendMessage('❌ Không thể chuyển khi có vô hạn tiền!', threadID)
      const bet = args[1] === 'all' ? senderMoney : parseInt(args[1], 10)
      if (Number.isNaN(bet) || bet <= 0 || senderMoney < bet)
        return api.sendMessage('❌ Số tiền chuyển không hợp lệ hoặc không đủ số dư!', threadID)
      await Currencies.decreaseMoney(senderID, bet)
      await Currencies.increaseMoney(targetID, bet)
      return api.sendMessage(`✅ Đã chuyển cho ${name} ${bet}$`, threadID)
    }

    if (permssion < 2)
      return api.sendMessage('⚠️ Bạn không đủ quyền hạn để thực thi lệnh này.', threadID)

    const val = parseFloat(args[1])
    let newMoney = currentMoney
    let actionText = ''

    switch (args[0]) {
      case '+':
        newMoney += val
        actionText = `được cộng thêm ${val}$`
        break
      case '-':
        newMoney -= val
        actionText = `bị trừ đi ${val}$`
        break
      case '*':
        newMoney *= val
        actionText = `được nhân lên ${val} lần`
        break
      case '/':
        if (!val) return api.sendMessage('❌ Không thể chia cho 0!', threadID)
        newMoney /= val
        actionText = `bị chia đi ${val} lần`
        break
      case '++':
        newMoney = Infinity
        actionText = `được thay đổi thành vô hạn`
        break
      case '--':
        newMoney = 0
        actionText = `bị reset về 0`
        break
      case '+-':
        newMoney = val
        actionText = `được thay đổi thành ${val}$`
        break
      case '^':
        newMoney = currentMoney ** val
        actionText = `được lũy thừa bậc ${val}`
        break
      case '√':
        if (!val) return api.sendMessage('❌ Không thể khai căn bậc 0!', threadID)
        newMoney = currentMoney ** (1 / val)
        actionText = `được căn bậc ${val}`
        break
      case '+%': {
        const add = (currentMoney * val) / 100
        newMoney += add
        actionText = `được cộng thêm ${val}% (${add}$)`
        break
      }
      case '-%': {
        const sub = (currentMoney * val) / 100
        newMoney -= sub
        actionText = `bị trừ đi ${val}% (${sub}$)`
        break
      }
      default:
        return api.sendMessage('❌ Lệnh không hợp lệ!', threadID)
    }

    const saved = newMoney === Infinity ? Infinity : parseInt(newMoney, 10) || 0
    await Currencies.setData(targetID, { money: saved })

    const time = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss - DD/MM/YYYY')
    return api.sendMessage(
      `💸 Money của ${name} ${actionText}\n💸 Số dư mới: ${saved}$\n⏰ Thời gian: ${time}`,
      threadID
    )
  } catch (e) {
    console.error(e)
    return api.sendMessage('🔥 Đã xảy ra lỗi hệ thống khi xử lý lệnh.', threadID)
  }
}
