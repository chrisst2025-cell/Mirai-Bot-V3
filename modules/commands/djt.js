const request = require('request')
const fs = require('node:fs')

module.exports.config = {
  name: 'djt',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'Hoàng ',
  description: '=))',
  commandCategory: '18+',
  usages: 'địt [tag người bạn cần địt]',
  cooldowns: 5,
  dependencies: {
    request: '',
    fs: '',
  },
}

module.exports.run = ({ api, event, args, client, __GLOBAL }) =>
  request('https://mucode1.000webhostapp.com/videosex.php', (_err, _response, body) => {
    const picData = JSON.parse(body)
    var _mention = Object.keys(event.mentions)[0]
    const getURL = picData.url
    const ext = getURL.substring(getURL.lastIndexOf('.') + 1)

    const callback = () => {
      api.sendMessage(
        {
          body: 'nung chua',
          attachment: fs.createReadStream(`${__dirname}/cache/videosex.${ext}`),
        },
        event.threadID,
        () => fs.unlinkSync(`${__dirname}/cache/videosex.${ext}`),
        event.messageID
      )
    }
    request(getURL)
      .pipe(fs.createWriteStream(`${__dirname}/cache/videosex.${ext}`))
      .on('close', callback)
  })
