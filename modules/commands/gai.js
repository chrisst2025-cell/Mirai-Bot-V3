module.exports.config = {
  name: 'gai',
  version: '1.0.5',
  hasPermssion: 0,
  credits: 'MOD',
  description: 'kho api của bot',
  commandCategory: '18+',
  usages: 'Tiện ích',
  cooldowns: 0,
}

module.exports.handleEvent = async ({ event, api }) => {
  if (event.body.toLowerCase() === 'api') {
    const _axios = require('axios')
    const _fs = require('fs-extra')
    const { threadID, messageID, userID } = event
    var msg = `==「 𝗞𝗵𝗼 𝗔𝗽𝗶 𝗕𝗼𝘁 」==\n━━━━━━━━━━━━━━\n𝟭: 𝗔𝗣𝗜 𝗠𝗣𝟯
𝟮: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗦𝗧𝗔𝗧𝗨𝗦
𝟯: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗚𝗔́𝗜
𝟰: 𝗔𝗣𝗜 𝗧𝗥𝗔𝗜
𝟱: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗡𝗛𝗔̣𝗖
𝟲: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗔𝗡𝗜𝗠𝗘
𝟳: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗖𝗢𝗦𝗣𝗟𝗔𝗬
𝟴: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗖𝗔̉𝗡𝗛 Đ𝗘̣𝗣
𝟵: 𝗔𝗣𝗜 𝗩𝗜𝗗𝗘𝗢 𝗞𝗛𝗢𝗔 𝗛𝗢̣𝗖
𝟭𝟬: 𝗔𝗣𝗜 𝗪𝗜𝗕𝗨
𝟭𝟭: 𝗔𝗣𝗜 𝗜𝗧𝗔𝗖𝗛𝗜
𝟭𝟮: 𝗔𝗣𝗜 𝗪𝗔𝗜𝗙𝗨
𝟭𝟯: 𝗔𝗣𝗜 𝗟𝗢𝗟𝗜
𝟭𝟰: 𝗔𝗣𝗜 𝗛𝗘𝗡𝗧𝗔𝗜
𝟭𝟱: 𝗔𝗣𝗜 𝗖𝗢𝗦𝗣𝗟𝗔𝗬
𝟭𝟲: 𝗔𝗣𝗜 𝗖𝗔𝗣𝗖𝗨𝗧`

    return api.sendMessage(
      {
        body: msg,
        attachment: (
          await require('axios')({
            url: (
              await require('axios')(
                'https://ccabceee-faad-495f-a75f-ea3b274643e2-00-1zc2m19bztoiu.sisko.replit.dev/anime'
              )
            ).data.url,
            method: 'GET',
            responseType: 'stream',
          })
        ).data,
      },
      event.threadID,
      (_error, info) => {
        global.client.handleReply.push({
          type: 'choosee',
          name: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
        })
      }
    )
  }
}
module.exports.handleReply = async ({
  args,
  event,
  Users,
  api,
  handleReply,
  Currencies,
  __GLOBAL,
}) => {
  const _axios = require('axios')
  const _fs = require('fs-extra')
  api.sendMessage(`𝐕𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐜𝐡𝐨̛̀ 𝟏 𝐜𝐡𝐮́𝐭 𝐝𝐞̂̉ 𝐥𝐨𝐚𝐝 `, event.threadID, (_err, info) =>
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
    }, 15000)
  )
  const _request = require('request')
  const _nameUser =
    (await Users.getData(event.senderID)).name || (await Users.getInfo(envent.senderID)).name
  const _data = (await Currencies.getData(event.senderID)).ghepTime
  var _name = await Users.getNameUser(event.senderID)

  switch (handleReply.type) {
    case 'choosee': {
      switch (event.body) {
        case '':
        case '':
        case '1': {
          const _axios = require('axios')
          api.unsendMessage(
            handleReply.messageID,
            typeof event !== 'undefined'
              ? event.threadID
              : typeof e !== 'undefined'
                ? e.threadID
                : typeof _ !== 'undefined'
                  ? _.threadID
                  : ''
          )
          return api.sendMessage(
            {
              body: `𝗠𝗣𝟯 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗻𝗲̀ `,
              attachment: (
                await require('axios')({
                  url: (
                    await require('axios')(
                      'https://ccabceee-faad-495f-a75f-ea3b274643e2-00-1zc2m19bztoiu.sisko.replit.dev/mp3'
                    )
                  ).data.data,
                  method: 'GET',
                  responseType: 'stream',
                })
              ).data,
            },
            event.threadID,
            event.messageID
          )
        }
        case '2': {
          const _axios = require('axios')
          api.unsendMessage(
            handleReply.messageID,
            typeof event !== 'undefined'
              ? event.threadID
              : typeof e !== 'undefined'
                ? e.threadID
                : typeof _ !== 'undefined'
                  ? _.threadID
                  : ''
          )
          return api.sendMessage(
            {
              body: `𝗩𝗶𝗱𝗲𝗼 𝘀𝘁𝗮𝘁𝘂𝘀 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗻𝗲̀ `,
              attachment: (
                await require('axios')({
                  url: (await require('axios')('')).data.data,
                  method: 'GET',
                  responseType: 'stream',
                })
              ).data,
            },
            event.threadID,
            event.messageID
          )
        }
        case '3': {
          const _axios = require('axios')
          api.unsendMessage(
            handleReply.messageID,
            typeof event !== 'undefined'
              ? event.threadID
              : typeof e !== 'undefined'
                ? e.threadID
                : typeof _ !== 'undefined'
                  ? _.threadID
                  : ''
          )
          return api.sendMessage(
            {
              body: `𝗩𝗶𝗱𝗲𝗼 𝗴𝗮́𝗶 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗻𝗲̀ `,
              attachment: (
                await require('axios')({
                  url: (
                    await require('axios')('https://scrapi--huygaming12.repl.co/images/vdgai')
                  ).data.url,
                  method: 'GET',
                  responseType: 'stream',
                })
              ).data,
            },
            event.threadID,
            event.messageID
          )
        }
        default: {
          api.unsendMessage(
            handleReply.messageID,
            typeof event !== 'undefined'
              ? event.threadID
              : typeof e !== 'undefined'
                ? e.threadID
                : typeof _ !== 'undefined'
                  ? _.threadID
                  : ''
          )
          return api.sendMessage(
            'API chưa được cập nhật cho lựa chọn này!',
            event.threadID,
            event.messageID
          )
        }
      }
    }
  }
}

module.exports.run = ({ api, event }) => {
  // Logic handled in handleReply and handleEvent
  return api.sendMessage(
    'Vui lòng trả lời tin nhắn API trong các chức năng chính để sử dụng lệnh gai',
    event.threadID,
    event.messageID
  )
}
