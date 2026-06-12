const axios = require('axios')
const moment = require('moment-timezone')
this.config = {
  name: 'capcut',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'DongDev',
  description: 'Thông tin từ nền tảng capcut',
  commandCategory: 'Ảnh',
  usages: '[]',
  cooldowns: 5,
  images: [],
}
this.run = async ({ api, event, args }) => {
  const { threadID: tid, messageID: mid, senderID: sid } = event
  const send = (content, tid, mid) => api.sendMessage(content, tid, mid)
  const _argument = args.slice(1).join(' ')
  switch (args[0]) {
    case 'search':
      try {
        const keyword = args.slice(1).join(' ')
        const searchData = await getdata(keyword)
        if (!searchData || searchData.length === 0) {
          send('Không tìm thấy kết quả.', tid, mid)
          return
        }
        const img = searchData.map((result) => result.cover_url)
        const listMessage = searchData
          .map(
            (result, index) =>
              `|› ${index + 1}. Title: ${result.title}\n|› Tác giả: ${result.author.name}\n──────────────────`
          )
          .join('\n')
        send(
          {
            body: `[ Capcut Search For Samples ]\n──────────────────\n${listMessage}\n\n📌 Reply (phản hồi) STT để tải video`,
            attachment: await Promise.all(img.map((url) => streamURL(url, 'jpg'))),
          },
          tid,
          (error, info) => {
            if (error) return console.error('Error sending message:', error)
            global.client.handleReply.push({
              type: 'search',
              name: exports.config.name,
              author: sid,
              messageID: info.messageID,
              result: searchData,
            })
          }
        )
      } catch (error) {
        console.error('Error:', error.message)
        send('Đã xảy ra lỗi, vui lòng thử lại sau.', tid, mid)
      }
      break
    default:
      api.sendMessage('📝 capcut search <keyword>', tid, mid)
      break
  }
}
function _convertTime(timestamp) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${day}/${month}/${year}`
}
const streamURL = (url, ext = 'jpg') =>
  require('axios')
    .get(url, { responseType: 'stream' })
    .then((res) => ((res.data.path = `tmp.${ext}`), res.data))
    .catch((_e) => null)
this.handleReply = async ({ event, api, handleReply, args }) => {
  const { threadID: tid, messageID: mid, body } = event
  switch (handleReply.type) {
    case 'search': {
      const choose = parseInt(body, 10)
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
      if (Number.isNaN(choose)) {
        return api.sendMessage('⚠️ Vui lòng nhập 1 con số', tid, mid)
      }
      if (choose > 6 || choose < 1) {
        return api.sendMessage('❎ Lựa chọn không nằm trong danh sách', tid, mid)
      }
      try {
        const chosenVideo = handleReply.result[choose - 1]
        const videoResponse = await axios.get(chosenVideo.video_url, { responseType: 'stream' })
        const videoData = videoResponse.data
        api.sendMessage(
          {
            body: `[ Capcut Video Info ]\n──────────────────\n|› Tiêu đề: ${chosenVideo.title}\n|› Tác giả: ${chosenVideo.author.name} (${chosenVideo.author.unique_id})\n|› Thời lượng: ${formatTime(chosenVideo.duration)} giây\n|› Số ảnh cần dùng: ${chosenVideo.fragment_count}\n|› Lượt dùng mẫu: ${chosenVideo.usage_amount}\n|› Lượt xem: ${chosenVideo.play_amount}\n|› Lượt thích: ${chosenVideo.like_count}\n|› Lượt comment: ${chosenVideo.interaction.comment_count}\n|› Lượt lưu: ${chosenVideo.favorite_count}\n|› Ngày tải lên: ${moment.unix(chosenVideo.create_time).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss - DD/MM/YYYY')}`,
            attachment: videoData,
          },
          tid,
          mid
        )
      } catch (error) {
        console.error('Error:', error.message)
        api.sendMessage('Đã xảy ra lỗi khi tải video.', tid, mid)
      }
      break
    }
    default:
      break
  }
}
function formatTime(time) {
  const totalSeconds = Math.floor(time / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
async function getdata(keyword) {
  const res = await axios.get(`https://hoanghao.me/api/capcut/search?keyword=${keyword}`)
  const results = res.data.data.video_templates
  const randomIndexes = []
  while (randomIndexes.length < 6) {
    const randomIndex = Math.floor(Math.random() * results.length)
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex)
    }
  }
  return randomIndexes.map((index) => results[index])
}
