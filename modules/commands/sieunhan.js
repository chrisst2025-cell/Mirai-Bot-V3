/*
 * @Module made by Binee
 * @No edit credits
 * @Ban user edit credits
 */
module.exports.config = {
  name: 'sieunhan',
  version: '1.0.2',
  hasPermssion: 0,
  credits: 'Binee',
  description: 'Game Siêu nhân gao có đặt cược </> Coder by Binee',
  commandCategory: 'Game',
  usages:
    '<[trắng/đỏ/bạc/vàng/biển/đen] hoặc[⚪/🔴/🔘/🟡/🔵/⚫]> <Số tiền cược (lưu ý phải trên 50$)>',
  cooldowns: 0,
}

module.exports.run = async function ({ api, event, args, Currencies, getText, permssion }) {
  try {
    const { threadID, messageID, senderID } = event
    const { getData, increaseMoney, decreaseMoney } = Currencies
    const request = require('request')
    const _axios = require('axios')
    if (this.config.credits !== 'Binee') {
      console.log('\x1b[33m[ WARN ]\x1b[37m » Đổi credits con cặc đjt mẹ mày luôn đấy con chó:))')
      return api.sendMessage(
        `[ WARN ] Phát hiện người điều hành bot ${global.config.BOTNAME} đổi credits modules "${this.config.name}"`,
        threadID,
        messageID
      )
    }
    const {
      readdirSync,
      readFileSync,
      writeFileSync,
      existsSync,
      copySync,
      createWriteStream,
      createReadStream,
    } = require('fs-extra')
    const slotItems = ['trắng', 'đỏ', 'bạc', 'vàng', 'biển', 'đen']
    const money = (await getData(senderID)).money
    if (Number.isNaN(args[1]) === true)
      return api.sendMessage(
        'Nội dung "Số tiền cược" mà bạn nhập không phải 1 con số hợp lệ!',
        threadID,
        messageID
      )
    var moneyBet = parseInt(args[1], 10)
    if (Number.isNaN(moneyBet) || moneyBet <= 50)
      return api.sendMessage('Số tiền đặt cược không được dưới 50$', threadID, messageID)
    if (moneyBet > money)
      return api.sendMessage('Tài khoản của bạn không đủ tiền để chơi.', threadID, messageID)
    var _number = [],
      list = [],
      listimg = [],
      _win = false
    var baucua1 = slotItems[Math.floor(Math.random() * slotItems.length)]
    var baucua2 = slotItems[Math.floor(Math.random() * slotItems.length)]
    var baucua3 = slotItems[Math.floor(Math.random() * slotItems.length)]
    // ARGS
    const content = args[0]
    var content1
    if (content === 'trắng' || content === '⚪') {
      content1 = 'trăng'
    } else if (content === 'đỏ' || content === '🔴') {
      content1 = 'do'
    } else if (content === 'bạc' || content === '🔘') {
      content1 === 'bac'
    } else if (content === 'vàng' || content === '🟡') {
      content1 = 'vang'
    } else if (content === 'biển' || content === '🔵') {
      content1 = 'bien'
    } else if (content === 'đen' || content === '⚫') {
      content1 = 'den'
    } else {
      return api.sendMessage(
        `Sai định dạng\n${global.config.PREFIX}${this.config.name} <[trắng/đỏ/bạc/vàng/biển/đen] hoặc[⚪/🔴/🔘/🟡/🔵/⚫]> <Số tiền cược (lưu ý phải trên 50$)>`,
        threadID,
        messageID
      )
    }
    // request
    if (!existsSync(`${__dirname}/data/assets/trang.jpg`)) {
      request('https://i.imgur.com/o6K6STA.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/trang.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/do.jpg`)) {
      request('https://i.imgur.com/6yB8LUg.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/do.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/bac.jpg`)) {
      request('https://i.imgur.com/nJdHgFV.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/bac.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/vang.jpg`)) {
      request('https://i.imgur.com/9oT0Pwk.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/vang.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/bien.jpg`)) {
      request('https://i.imgur.com/GouAB46.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/bien.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/den.jpg`)) {
      request('https://i.imgur.com/fvCORQp.jpg').pipe(
        createWriteStream(`${__dirname}/data/assets/den.jpg`)
      )
    }
    if (!existsSync(`${__dirname}/data/assets/snhangao.gif`)) {
      request('https://i.imgur.com/JSa5heh.gif').pipe(
        createWriteStream(`${__dirname}/data/assets/snhangao.gif`)
      )
    }
    // snhangao 1
    if (baucua1 === 'trắng') {
      var _bau1 = 'trang'
      var _bau_1 = `${__dirname}/data/assets/trang.jpg`
    } else if (baucua1 === 'đỏ') {
      var _bau1 = 'do'
      var _bau_1 = `${__dirname}/data/assets/do.jpg`
    } else if (baucua1 === 'bạc') {
      var _bau1 = 'bac'
      var _bau_1 = `${__dirname}/data/assets/bac.jpg`
    } else if (baucua1 === 'vàng') {
      var _bau1 = 'vang'
      var _bau_1 = `${__dirname}/data/assets/vang.jpg`
    } else if (baucua1 === 'biển') {
      var _bau1 = 'bien'
      var _bau_1 = `${__dirname}/data/assets/bien.jpg`
    } else if (baucua1 === 'đen') {
      var bau1 = 'den'
      var _bau_1 = `${__dirname}/data/assets/den.jpg`
    }
    // baucua 2
    if (baucua2 === 'trắng') {
      var _bau2 = 'trang'
      var _bau_2 = `${__dirname}/data/assets/trang.jpg`
    } else if (baucua2 === 'đỏ') {
      var _bau2 = 'do'
      var _bau_2 = `${__dirname}/data/assets/do.jpg`
    } else if (baucua2 === 'bạc') {
      var _bau2 = 'bac'
      var _bau_2 = `${__dirname}/data/assets/bac.jpg`
    } else if (baucua2 === 'vàng') {
      var _bau2 = 'vang'
      var _bau_2 = `${__dirname}/data/assets/vvang.jpg`
    } else if (baucua2 === 'biển') {
      var _bau2 = 'bien'
      var _bau_2 = `${__dirname}/data/assets/bien.jpg`
    } else if (baucua2 === 'đen') {
      var bau2 = 'den'
      var _bau_2 = `${__dirname}/data/assets/den.jpg`
    }
    // baucua 3
    if (baucua3 === 'trắng') {
      var _bau3 = 'trang'
      var _bau_3 = `${__dirname}/data/assets/trang.jpg`
    } else if (baucua3 === 'đỏ') {
      var _bau3 = 'do'
      var _bau_3 = `${__dirname}/data/assets/do.jpg`
    } else if (baucua3 === 'bạc') {
      var _bau3 = 'bac'
      var _bau_3 = `${__dirname}/data/assets/bac.jpg`
    } else if (baucua3 === 'vàng') {
      var _bau3 = 'vang'
      var _bau_3 = `${__dirname}/data/assets/vang.jpg`
    } else if (baucua3 === 'biển') {
      var _bau3 = 'bien'
      var _bau_3 = `${__dirname}/data/assets/bien.jpg`
    } else if (baucua3 === 'đen') {
      var bau3 = 'den'
      var _bau_3 = `${__dirname}/data/assets/den.jpg`
    }
    // array baucua
    list.push(bau1)
    list.push(bau2)
    list.push(bau3)
    // array img
    listimg.push(createReadStream(`${__dirname}/data/assets/${bau1}.jpg`))
    listimg.push(createReadStream(`${__dirname}/data/assets/${bau2}.jpg`))
    listimg.push(createReadStream(`${__dirname}/data/assets/${bau3}.jpg`))
    // ICON
    // icon 1
    if (bau1 === 'trang') {
      var _icon1 = '⚪'
    } else if (bau1 === 'do') {
      var _icon1 = '🔴'
    } else if (bau1 === 'bac') {
      var _icon1 = '🔘'
    } else if (bau1 === 'vang') {
      var _icon1 = '🟡'
    } else if (bau1 === 'bien') {
      var _icon1 = '🔵'
    } else if (bau1 === 'den') {
      var icon1 = '⚫'
    }
    // icon 2
    if (bau2 === 'trang') {
      var _icon2 = '⚪'
    } else if (bau2 === 'do') {
      var _icon2 = '🔴'
    } else if (bau2 === 'bac') {
      var _icon2 = '🔘'
    } else if (bau2 === 'vang') {
      var _icon2 = '🟡'
    } else if (bau2 === 'bien') {
      var _icon2 = '🔵'
    } else if (bau2 === 'den') {
      var icon2 = '⚫'
    }
    // icon 3
    if (bau3 === 'trang') {
      var _icon3 = '⚪'
    } else if (bau3 === 'do') {
      var _icon3 = '🔴'
    } else if (bau3 === 'bac') {
      var _icon3 = '🔘'
    } else if (bau3 === 'vang') {
      var _icon3 = '🟡'
    } else if (bau3 === 'bien') {
      var _icon3 = '🔵'
    } else if (bau3 === 'den') {
      var icon3 = '⚫'
    }
    // sendMessage
    api.sendMessage(
      {
        body: '[🚧] Siu nhân nào ra đây UwU [🚧] \n[🔰] Chờ đợi là hạnh phúc chúc may mắn [🔰]:>>',
        attachment: createReadStream(`${__dirname}/data/assets/snhangao.gif`),
      },
      threadID,
      (err, info) => {
        if (err) return api.sendMessage(err, threadID, messageID)
        setTimeout(() => {
          api.unsendMessage(
            info.messageID,
            typeof event !== 'undefined'
              ? event.threadID
              : typeof e !== 'undefined'
                ? e.threadID
                : typeof _ !== 'undefined'
                  ? _.threadID
                  : ''
          )
          var check = list.findIndex((i) => i.toString() === content1)
          var check2 = list.includes(content1)
          //console.log(check);
          //console.log(icon1 + icon2 + icon3);
          if (check >= 0 || check2 === true) {
            return api.sendMessage(
              {
                body: `[⚜️] Màu của siêu nhân tương ứng [⚜️]: ${icon1} | ${icon2} | ${icon3}\n[🔰] Đoán đúng rùi nên cho bạn \n[💸] ${moneyBet * 3} 𝙑𝙉𝘿`,
                attachment: listimg,
              },
              threadID,
              () => Currencies.increaseMoney(senderID, moneyBet * 3),
              messageID
            )
          } else if (check < 0 || check2 === false) {
            return api.sendMessage(
              {
                body: `[⚜️] Màu của siêu nhân tương ứng [⚜️]: ${icon1} | ${icon2} | ${icon3}\n[🔰] Bạn đã thua và bị trừ \n[💸] ${moneyBet} 𝙑𝙉𝘿`,
                attachment: listimg,
              },
              threadID,
              () => Currencies.decreaseMoney(senderID, moneyBet),
              messageID
            )
          } else {
            return api.sendMessage('Đã xảy ra lỗi. Vui lòng thử lại sau 5s', threadID, messageID)
          }
        }, 3000)
      },
      messageID
    )
  } catch (err) {
    console.error(err)
    return api.sendMessage(err, event.threadID, event.messageID)
  }
}
