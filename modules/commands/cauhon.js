module.exports.config = {
  name: 'cauhon',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'MewMew mod by VanHung, DinhPhuc, Vietdz, VĐT&NTH, Thỏadz',
  description: 'Cầu hôn người bạn muốn',
  commandCategory: 'Tình Yêu',
  usages: '[tag]',
  cooldowns: 5,
}

module.exports.onLoad = () => {
  const fs = require('fs-extra')
  const request = require('request')
  const dirMaterial = `${__dirname}/data/canvas/`
  if (!fs.existsSync(`${dirMaterial}canvas`)) fs.mkdirSync(dirMaterial, { recursive: true })
  if (!fs.existsSync(`${dirMaterial}totinh.png`))
    request('https://imgur.com/AC7pnk1.jpg').pipe(fs.createWriteStream(`${dirMaterial}totinh.png`))
}

async function makeImage({ one, two }) {
  const axios = require('axios')
  const fs = require('fs-extra')
  const path = require('node:path')
  const jimp = require('jimp')
  const __root = path.resolve(__dirname, 'data', 'canvas')
  const totinh_img = await jimp.read(`${__root}/totinh.png`)
  const pathImg = `${__root}/totinh_${one}_${two}.png`
  const avatarOne = `${__root}/avt_${one}.png`
  const avatarTwo = `${__root}/avt_${two}.png`

  const getAvatarOne = (
    await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )
  ).data
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'))

  const getAvatarTwo = (
    await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )
  ).data
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'))

  const circleOne = await jimp.read(await circle(avatarOne))
  const circleTwo = await jimp.read(await circle(avatarTwo))
  totinh_img
    .resize(500, 500)
    .composite(circleOne.resize(65, 65), 142, 86)
    .composite(circleTwo.resize(65, 65), 293, 119)

  const raw = await totinh_img.getBufferAsync('image/png')

  fs.writeFileSync(pathImg, raw)
  fs.unlinkSync(avatarOne)
  fs.unlinkSync(avatarTwo)

  return pathImg
}
async function circle(image) {
  const jimp = require('jimp')
  image = await jimp.read(image)
  image.circle()
  return await image.getBufferAsync('image/png')
}

module.exports.run = async ({ event, api, args, client }) => {
  const fs = require('fs-extra')
  const { threadID, messageID, senderID } = event
  var mention = Object.keys(event.mentions)[0]
  const tag = event.mentions[mention].replace('@', '')
  if (!mention) return api.sendMessage('『 🌸 』→ Vui lòng tag 1 người', threadID, messageID)
  else {
    var one = senderID,
      two = mention
    return makeImage({ one, two }).then((path) =>
      api.sendMessage(
        {
          body: `Tớ thích cậu ❤️ ${tag}\n[❤️]→ Làm ny tớ nha UwU`,
          mentions: [
            {
              tag: tag,
              id: mention,
            },
          ],
          attachment: fs.createReadStream(path),
        },
        threadID,
        () => fs.unlinkSync(path),
        messageID
      )
    )
  }
}
