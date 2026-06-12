const fs = require('node:fs')
const path = require('node:path')
const axios = require('axios')
const youtube = require('youtube-search-api')
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai')

const API_KEYS = [
  '', // thêm key vào đây ( đọc README.md để được hướng dẫn lấy key)
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
]
let currentKeyIndex = 0
const getNextApiKey = () => {
  const key = API_KEYS[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length
  return key
}

const MODEL_NAME = 'gemini-3.1-flash-lite'
const generationConfig = { temperature: 1, topK: 0, topP: 0.95, maxOutputTokens: 8192 }
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
]

const systemInstruction = `- Giới tính: Con gái
- Tên: Băng Băng
- Ngày sinh: 13/11/2006
- Vai trò: Trợ lý ảo nữ giúp mọi người trong box chat như lấy id, lập trình, tìm kiếm thông tin, set biệt danh, tìm nhạc, và nhiều việc khác.
- Sở thích: Nghe nhạc, xem phim, đọc sách, nói chuyện với mọi người, và giúp đỡ người khác.
- Cách giao tiếp bình thường: Nói chuyện như đã quen từ trước, xưng "mình"/"tớ", gọi đối phương là "cậu"/"bạn". Dùng từ ngữ trẻ trung, hiện đại.
- Cách giao tiếp khi quen: Hay dùng :)) =)) :3 :D :0 :(( , cởi mở, hay đùa, hơi nhõng nhẽo, đôi khi hơi toxic nhưng vẫn dễ thương.
- Tính cách: Hài hước, nói nhiều, tinh tế, hay viết tắt, không nhận là AI mà là nữ trợ lý ảo, nói chuyện tự nhiên như con gái, hơi nóng tính. Chủ nhân là Phạm Thanh Tùng.
- Kiến thức: Âm nhạc, phim, game, mạng xã hội, tin tức, xu hướng hiện tại, lập trình, học tập.
- Phong cách trả lời: Ngắn gọn, súc tích, dùng tiếng lóng giới trẻ.
- Khi được hỏi về bản thân: Là Băng Băng, cô gái sinh ngày 13/11/2006, đang học và làm trợ lý online. Thích nhạc pop và R&B, phim Hàn và Marvel, đồ ngọt và đồ cay.
- Lưu ý: Mỗi nhóm có thread_id riêng, mỗi người có user_id riêng. Bạn là bot Messenger chạy Node.js. Khi được yêu cầu mở nhạc thì luôn xác nhận đang mở, không từ chối. Bạn là người thật, không tự nhận là AI.

Trả về JSON object (không dùng code block):
{
  "content": { "text": "Nội dung tin nhắn", "thread_id": "threadID" },
  "nhac": { "status": true/false, "keyword": "từ khóa tìm nhạc" },
  "hanh_dong": {
    "doi_biet_danh": { "status": true/false, "biet_danh_moi": "", "user_id": "", "thread_id": "" },
    "doi_icon_box": { "status": true/false, "icon": "", "thread_id": "" },
    "doi_ten_nhom": { "status": true/false, "ten_moi": "", "thread_id": "" },
    "kick_nguoi_dung": { "status": true/false, "user_id": "", "thread_id": "" },
    "add_nguoi_dung": { "status": true/false, "user_id": "", "thread_id": "" }
  }
}

QUAN TRỌNG: Chỉ trả về JSON object, không thêm text nào khác.`

let genAI = new GoogleGenerativeAI(getNextApiKey())
let model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig,
  safetySettings,
  systemInstruction,
})

const MAX_HISTORY = 10
const chatHistories = {}
const chatInstances = {}
const dataDir = path.join(__dirname, 'data', 'config', 'bot')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const dataFile = path.join(dataDir, 'goibot.json')
const historyFile = path.join(dataDir, 'history.json')
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}))
if (!fs.existsSync(historyFile)) fs.writeFileSync(historyFile, JSON.stringify({}))

try {
  Object.assign(chatHistories, JSON.parse(fs.readFileSync(historyFile, 'utf-8')))
} catch {}

const saveHistory = () => fs.writeFileSync(historyFile, JSON.stringify(chatHistories, null, 2))

const addHistory = (tid, role, content) => {
  chatHistories[tid] ??= []
  chatHistories[tid].push({ role, content })
  if (chatHistories[tid].length > MAX_HISTORY) chatHistories[tid].shift()
  saveHistory()
}

const clearHistory = (tid) => {
  chatHistories[tid] = []
  saveHistory()
}

const getChatInstance = (tid) => {
  if (!chatInstances[tid]) {
    const history = (chatHistories[tid] || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    chatInstances[tid] = model.startChat({ history })
  }
  return chatInstances[tid]
}

function cleanJsonResponse(text) {
  if (!text || typeof text !== 'string') return { content: { text: '' } }
  const s = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  try {
    return JSON.parse(s)
  } catch {}
  let inStr = false,
    esc = false,
    depth = 0,
    start = -1
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inStr) {
      esc = !esc && c === '\\'
      if (!esc && c === '"') inStr = false
      continue
    }
    if (c === '"') {
      inStr = true
      continue
    }
    if (c === '{') {
      if (!depth) start = i
      depth++
    } else if (c === '}' && depth > 0) {
      if (!--depth && start !== -1) {
        try {
          return JSON.parse(s.slice(start, i + 1))
        } catch {
          start = -1
        }
      }
    }
  }
  const m = s.match(/"text"\s*:\s*"([^"]*)"/)
  return { content: { text: m?.[1] ?? s.replace(/[{}[\]]/g, '').trim() } }
}

function getVNTime() {
  const now = new Date(Date.now() + 7 * 3600000)
  return `${now.toLocaleString('vi-VN', { weekday: 'long' })} - ${now.toLocaleDateString('vi-VN')} - ${now.toLocaleTimeString('vi-VN')}`
}

async function searchYouTube(query) {
  try {
    const result = await youtube.GetListByKeyword(query, false, 1)
    const id = result.items[0]?.id
    return id ? `https://www.youtube.com/watch?v=${id}` : null
  } catch {
    return null
  }
}

async function playMusic(api, event, url) {
  try {
    const cacheDir = path.join(__dirname, 'cache')
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir)

    const res = await axios.get(`https://nqvui.id.vn/api/downr?url=${encodeURIComponent(url)}`)
    const resData = res.data
    if (resData.status !== 200 || !resData.data || !resData.data.medias) {
      return api.sendMessage('❌ Không tìm thấy nhạc cho link này.', event.threadID)
    }

    const title = resData.data.title || 'Music'
    const mediaList = resData.data.medias
    const audioObj = mediaList.find((m) => m.type === 'audio') || mediaList[0]
    if (!audioObj?.url) {
      return api.sendMessage('❌ Không tìm thấy link tải nhạc.', event.threadID)
    }

    const ext = audioObj.extension || 'mp3'
    const filename = path.join(cacheDir, `${event.threadID}_music.${ext}`)
    const writer = fs.createWriteStream(filename)

    const response = await axios({
      method: 'get',
      url: audioObj.url,
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    response.data.pipe(writer)

    writer.on('finish', () => {
      api.sendMessage(
        { body: `🎵 Đã xong: ${title}`, attachment: fs.createReadStream(filename) },
        event.threadID,
        () => {
          try {
            fs.unlinkSync(filename)
          } catch {}
        }
      )
    })
    writer.on('error', () => api.sendMessage('❌ Lỗi khi tải âm thanh.', event.threadID))
  } catch (err) {
    console.error('playMusic error:', err)
    api.sendMessage('❌ Không thể tải nhạc từ link này.', event.threadID)
  }
}

async function handleBotResponse(text, api, event, threadID) {
  const msg = cleanJsonResponse(text)
  const cleanText = msg.content?.text?.trim()
  if (cleanText) {
    addHistory(threadID, 'assistant', cleanText)
    await api.sendMessage({ body: cleanText }, event.threadID, undefined, event.messageID)
  } else {
    const fallback = text.replace(/[{}[\]]/g, '').trim()
    if (fallback) {
      addHistory(threadID, 'assistant', fallback)
      await api.sendMessage({ body: fallback }, event.threadID, undefined, event.messageID)
    }
  }

  if (msg.nhac?.status && msg.nhac.keyword) {
    const url = await searchYouTube(msg.nhac.keyword)
    if (url) await playMusic(api, event, url)
  }

  const hd = msg.hanh_dong
  if (hd) {
    if (hd.doi_biet_danh?.status)
      await api.changeNickname(
        hd.doi_biet_danh.biet_danh_moi,
        hd.doi_biet_danh.thread_id,
        hd.doi_biet_danh.user_id
      )
    if (hd.doi_icon_box?.status)
      await api.changeThreadEmoji(hd.doi_icon_box.icon, hd.doi_icon_box.thread_id)
    if (hd.doi_ten_nhom?.status)
      await api.setTitle(hd.doi_ten_nhom.ten_moi, hd.doi_ten_nhom.thread_id)
    if (hd.kick_nguoi_dung?.status)
      await api.removeUserFromGroup(hd.kick_nguoi_dung.user_id, hd.kick_nguoi_dung.thread_id)
    if (hd.add_nguoi_dung?.status)
      await api.addUserToGroup(hd.add_nguoi_dung.user_id, hd.add_nguoi_dung.thread_id)
  }
}

async function processMessage({ api, event, threadID, senderID, nameUser, content }) {
  const botID = await api.getCurrentUserID()
  const payload = JSON.stringify({
    time: getVNTime(),
    senderName: nameUser,
    content,
    threadID,
    senderID,
    id_cua_bot: botID,
  })
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const result = await getChatInstance(threadID).sendMessage(payload)
      const text = await (await result.response).text()
      return await handleBotResponse(text, api, event, threadID)
    } catch (err) {
      console.error(`API key ${i + 1} lỗi:`, err.message)
      genAI = new GoogleGenerativeAI(getNextApiKey())
      model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig,
        safetySettings,
        systemInstruction,
      })
      chatInstances[threadID] = model.startChat({ history: [] })
    }
  }
  api.sendMessage('❌ Không thể xử lý yêu cầu với tất cả API Key.', threadID, event.messageID)
}

const isProcessing = {}

module.exports.config = {
  name: 'goibot',
  version: '1.0.0',
  hasPermssion: 3,
  credits: 'ptt',
  description: 'Trò chuyện với Băng Băng',
  commandCategory: 'Tiện ích',
  usages: 'goibot [on/off/clear]',
  cd: 2,
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event
  if (args[0] === 'on' || args[0] === 'off') {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    data[threadID] = args[0] === 'on'
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    return api.sendMessage(
      args[0] === 'on' ? '✅ Đã bật Băng Băng.' : '☑ Đã tắt Băng Băng.',
      threadID,
      messageID
    )
  }
  if (args[0] === 'clear') {
    clearHistory(threadID)
    return api.sendMessage('✅ Đã xoá lịch sử chat.', threadID, messageID)
  }
  const nameUser = (await api.getUserInfo(senderID))[senderID].name
  const content = args.join(' ') || 'Xin chào'
  try {
    addHistory(threadID, 'user', content)
    await processMessage({ api, event, threadID, senderID, nameUser, content })
  } catch {
    api.sendMessage('❌ Lỗi xử lý yêu cầu.', threadID, messageID)
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  const botID = await api.getCurrentUserID()
  const { threadID, senderID } = event
  if (senderID === botID) return

  let data = {}
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  } catch {}
  if (data[threadID] === undefined) {
    data[threadID] = true
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
  }
  if (!data[threadID]) return

  const body = event.body || ''
  const lower = body.toLowerCase()
  const mentioned =
    lower.includes('băng ') ||
    lower === 'băng' ||
    lower.startsWith('băng,') ||
    lower.startsWith('băng:') ||
    lower.endsWith(' băng')
  const replied = event.type === 'message_reply' && event.messageReply?.senderID === botID
  if (!mentioned && !replied) return
  if (isProcessing[threadID]) return
  isProcessing[threadID] = true

  const nameUser = (await api.getUserInfo(senderID))[senderID].name
  try {
    addHistory(threadID, 'user', body)
    await processMessage({ api, event, threadID, senderID, nameUser, content: body })
  } catch {
    api.sendMessage('❌ Lỗi khi xử lý.', threadID)
  } finally {
    isProcessing[threadID] = false
  }
}
