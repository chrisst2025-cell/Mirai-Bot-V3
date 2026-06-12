module.exports.config = {
  name: 'info',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'HungCho Mod By NguyenHoangAnhProCoder',
  description: '',
  commandCategory: 'Thống kê',
  usages: '',
  cooldowns: 4,
  dependencies: {
    request: '',
    fs: '',
  },
}

module.exports.run = async ({ api, event, args, Threads }) => {
  const fs = require('fs-extra')
  const request = require('request')
  //getPrefix
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {}
  const prefix = Object.hasOwn(threadSetting, 'PREFIX')
    ? threadSetting.PREFIX
    : global.config.PREFIX
  if (args.length === 0)
    return api.sendMessage(
      `Bạn có thể dùng:\n\n${prefix}${this.config.name} user => nó sẽ lấy thông tin của chính bạn.\n\n${prefix}${this.config.name} user @[Tag] => nó sẽ lấy thông tin người bạn tag.\n\n${prefix}${this.config.name} box => nó sẽ lấy thông tin box của bạn (số thành viên,...)\n\n${prefix}${this.config.name} user box [uid || tid.:\n\n${prefix}${this.config.name} admin => Thông tin cá nhân của Admin Bot]`,
      event.threadID,
      event.messageID
    )
  if (args[0] === 'box') {
    if (args[1]) {
      const threadInfo = await api.getThreadInfo(args[1])
      const imgg = threadInfo.imageSrc
      var gendernam = []
      var gendernu = []
      for (const z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender
        if (gioitinhone === 'MALE') {
          gendernam.push(gioitinhone)
        } else {
          gendernu.push(gioitinhone)
        }
      }
      var nam = gendernam.length
      var nu = gendernu.length
      const sex = threadInfo.approvalMode
      var pd = sex === false ? 'tắt' : sex === true ? 'bật' : 'Kh'
      if (!imgg)
        api.sendMessage(
          `🍁 𝙄𝙣𝙛𝙤 𝙗𝙤𝙭 🍁\n👀 Tên nhóm: ${threadInfo.threadName}\n🐧 TID: ${args[1]}\n🦋 Phê duyệt: ${pd}\n🐤 Emoji: ${threadInfo.emoji}\n☺️ Thông tin: \n» ${threadInfo.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n» Gồm ${nam} nam và ${nu} nữ.\n» Tổng số tin nhắn: ${threadInfo.messageCount}.`,
          event.threadID,
          event.messageID
        )
      else
        var callback = () =>
          api.sendMessage(
            {
              body: `🍁 𝙄𝙣𝙛𝙤 𝙗𝙤𝙭 🍁\n👀 Tên nhóm: ${threadInfo.threadName}\n🐧 TID: ${args[1]}\n🦋 Phê duyệt: ${pd}\n🐤 Emoji: ${threadInfo.emoji}\n☺️ Thông tin: \n» ${threadInfo.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n» Gồm ${nam} nam và ${nu} nữ.\n» Tổng số tin nhắn: ${threadInfo.messageCount}.`,
              attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
            },
            event.threadID,
            () => fs.unlinkSync(`${__dirname}/cache/1.png`),
            event.messageID
          )
      return request(encodeURI(`${threadInfo.imageSrc}`))
        .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
        .on('close', () => callback())
    }

    const threadInfo = await api.getThreadInfo(event.threadID)
    const img = threadInfo.imageSrc
    var gendernam = []
    var gendernu = []
    for (const z in threadInfo.userInfo) {
      var gioitinhone = threadInfo.userInfo[z].gender
      if (gioitinhone === 'MALE') {
        gendernam.push(gioitinhone)
      } else {
        gendernu.push(gioitinhone)
      }
    }
    var nam = gendernam.length
    var nu = gendernu.length
    const sex = threadInfo.approvalMode
    var pd = sex === false ? 'tắt' : sex === true ? 'bật' : 'Kh'
    if (!img)
      api.sendMessage(
        `🍁 𝙄𝙣𝙛𝙤 𝙗𝙤𝙭 🍁\n👀 Tên nhóm: ${threadInfo.threadName}\n🐧 TID: ${event.threadID}\n🦋 Phê duyệt: ${pd}\n🐤 Emoji: ${threadInfo.emoji}\n☺️ Thông tin: \n» ${threadInfo.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n» Gồm ${nam} nam và ${nu} nữ.\n» Tổng số tin nhắn: ${threadInfo.messageCount}.`,
        event.threadID,
        event.messageID
      )
    else
      var callback = () =>
        api.sendMessage(
          {
            body: `🍁 𝙄𝙣𝙛𝙤 𝙗𝙤𝙭 🍁\n👀 Tên nhóm: ${threadInfo.threadName}\n🐧 TID: ${event.threadID}\n🦋 Phê duyệt: ${pd}\n🐤 Emoji: ${threadInfo.emoji}\n☺️ Thông tin: \n» ${threadInfo.participantIDs.length} thành viên và ${threadInfo.adminIDs.length} quản trị viên.\n» Gồm ${nam} nam và ${nu} nữ.\n» Tổng số tin nhắn: ${threadInfo.messageCount}.`,
            attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
          },
          event.threadID,
          () => fs.unlinkSync(`${__dirname}/cache/1.png`),
          event.messageID
        )
    return request(encodeURI(`${threadInfo.imageSrc}`))
      .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
      .on('close', () => callback())
  }
  if (args.length === 0)
    return api.sendMessage(
      `Bạn có thể dùng:\n\n${prefix}${this.config.name} user => nó sẽ lấy thông tin của chính bạn.\n\n${prefix}${this.config.name} user @[Tag] => nó sẽ lấy thông tin người bạn tag.\n\n${prefix}${this.config.name} box => nó sẽ lấy thông tin box của bạn (số thành viên, djt nhau,...)\n\n${prefix}${this.config.name} user box [uid || tid]`,
      event.threadID,
      event.messageID
    )
  if (args[0] === 'admin') {
    var callback = () =>
      api.sendMessage(
        {
          body: `✘ 𝑻𝒉𝒐̂𝒏𝒈 𝑻𝒊𝒏 𝑨𝒅𝒎𝒊𝒏 𝑩𝒐𝒕 ✘
👀 Tên: ${global.config.AMDIN_NAME}
💮 Biệt danh: TatsuYTB
❎ Ngày tháng năm sinh: 09/10/2005
👤 Giới tính: Nam
💫 Chiều cao cân nặng: 1m75 x 65kg
💘 Mối quan hệ: Hẹn Hò
🌎 Quê quán: Phú Thọ
🏰 Sống tại: Việt Nam
👫 Gu: Đoán Xem
🌸 Tính cách: Chịu
🌀 Sở thích: Chơi game, nghe nhạc, ăn, ngủ
💻Contact💻
☎ SĐT&Zalo: **
🌐 Facebook: ${global.config.FACEBOOK_ADMIN}
✉️ Email: k có đâu=))`,
          attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
        },
        event.threadID,
        () => fs.unlinkSync(`${__dirname}/cache/1.png`)
      )
    return request(
      encodeURI(
        `https://graph.facebook.com/${100072447776739}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      )
    )
      .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
      .on('close', () => callback())
  }

  if (args[0] === 'user') {
    if (!args[1]) {
      if (event.type === 'message_reply') id = event.messageReply.senderID
      else id = event.senderID
      const data = await api.getUserInfo(id)
      const _url = data[id].profileUrl
      const b =
        data[id].isFriend === false ? 'không !' : data[id].isFriend === true ? 'có !' : 'Đéo'
      const sn = data[id].vanity
      const name = await data[id].name
      var sex = await data[id].gender
      var gender = sex === 2 ? 'Nam' : sex === 1 ? 'Nữ' : 'Trần Đức Bo'
      var callback = () =>
        api.sendMessage(
          {
            body:
              `🍁 𝙄𝙣𝙛𝙤 𝙪𝙨𝙚𝙧 🍁\n😚Tên: ${name}` +
              `\n🏝URL cá nhân:m.facebook.com/${id}` +
              `\n💦Tên người dùng: ${sn}\n🐧UID: ${id}\n🦋Giới tính: ${gender}\n❄️Kết bạn bot: ${b}`,
            attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
          },
          event.threadID,
          () => fs.unlinkSync(`${__dirname}/cache/1.png`),
          event.messageID
        )
      return request(
        encodeURI(
          `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        )
      )
        .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
        .on('close', () => callback())
    } else {
      if (args.join().indexOf('@') !== -1) {
        var mentions = Object.keys(event.mentions)
        const data = await api.getUserInfo(mentions)
        const _url = data[mentions].profileUrl
        const b =
          data[mentions].isFriend === false
            ? 'không !'
            : data[mentions].isFriend === true
              ? 'có !'
              : 'Đéo'
        const sn = data[mentions].vanity
        const name = await data[mentions].name
        var sex = await data[mentions].gender
        var gender = sex === 2 ? 'Nam' : sex === 1 ? 'Nữ' : 'Trần Đức Bo'
        var callback = () =>
          api.sendMessage(
            {
              body:
                `🍁 𝙄𝙣𝙛𝙤 𝙪𝙨𝙚𝙧 🍁\n😚Tên: ${name}` +
                `\n🏝URL cá nhân:m.facebook.com/${id}` +
                `\n💦Tên người dùng: ${sn}\n🐧UID: ${mentions}\n🦋Giới tính: ${gender}\n❄️Kết bạn bot: ${b}`,
              attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
            },
            event.threadID,
            () => fs.unlinkSync(`${__dirname}/cache/1.png`),
            event.messageID
          )
        return request(
          encodeURI(
            `https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
          )
        )
          .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
          .on('close', () => callback())
      } else {
        const data = await api.getUserInfo(args[1])
        const _url = data[args[1]].profileUrl
        const b =
          data[args[1]].isFriend === false
            ? 'không !'
            : data[args[1]].isFriend === true
              ? 'có !'
              : 'Đéo'
        const sn = data[args[1]].vanity
        const name = await data[args[1]].name
        var sex = await data[args[1]].gender
        var gender = sex === 2 ? 'Nam' : sex === 1 ? 'Nữ' : 'Trần Đức Bo'
        var callback = () =>
          api.sendMessage(
            {
              body:
                `🍁 𝙄𝙣𝙛𝙤 𝙪𝙨𝙚𝙧 🍁\n😚Tên: ${name}` +
                `\n🏝URL cá nhân:m.facebook.com/${id}` +
                `\n💦Tên người dùng: ${sn}\n🐧UID: ${args[1]}\n🦋Giới tính: ${gender}\n❄️Kết bạn bot: ${b}`,
              attachment: fs.createReadStream(`${__dirname}/cache/1.png`),
            },
            event.threadID,
            () => fs.unlinkSync(`${__dirname}/cache/1.png`),
            event.messageID
          )
        return request(
          encodeURI(
            `https://graph.facebook.com/${args[1]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
          )
        )
          .pipe(fs.createWriteStream(`${__dirname}/cache/1.png`))
          .on('close', () => callback())
      }
    }
  }
}
