module.exports.config = {
  name: 'dizz',
  version: '2.1.0', // Nâng version
  hasPermssion: 1,
  credits: 'Lê Bá Bách, Optimized by G3K',
  description: 'Dizz người bạn tag (bắt buộc nhập số lần, dùng "dizz off" để tắt)',
  commandCategory: 'Spam',
  usages: '[@mention] [số lần] hoặc [off]',
  cooldowns: 10,
}

// --- CẤU HÌNH HỆ THỐNG ---
const CFG = {
  MAX_LIMIT: 100,
  MAX_ACTIVE_THREADS: 10,
  MIN_DELAY: 500,
  MAX_DELAY: 1000,
}

const stateManager = new Map()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const getRandomDelay = () =>
  Math.floor(Math.random() * (CFG.MAX_DELAY - CFG.MIN_DELAY + 1)) + CFG.MIN_DELAY

module.exports.run = async ({ api, args, event }) => {
  const { threadID, messageID, mentions } = event

  try {
    // --- 1. XỬ LÝ LỆNH DỪNG (OFF) ---
    if (args.length > 0 && args[0].toLowerCase() === 'off') {
      if (stateManager.has(threadID)) {
        stateManager.delete(threadID) // Xóa khỏi danh sách chạy => Vòng lặp tự ngắt
        return api.sendMessage('🛑 Đã dừng quy trình dizz thành công!', threadID, messageID)
      }
      return api.sendMessage(
        '❎ Hiện tại không có quy trình dizz nào đang chạy.',
        threadID,
        messageID
      )
    }

    // --- 2. KIỂM TRA ĐẦU VÀO ---
    const mentionID = Object.keys(mentions)[0]
    if (!mentionID) {
      return api.sendMessage(
        '⚠️ Vui lòng tag 1 người bạn muốn dizz! Ví dụ: dizz @tag 20',
        threadID,
        messageID
      )
    }

    // Kiểm tra tài nguyên server
    if (stateManager.size >= CFG.MAX_ACTIVE_THREADS && !stateManager.has(threadID)) {
      return api.sendMessage(
        `⚠️ Server bận (Max ${CFG.MAX_ACTIVE_THREADS} nhóm). Vui lòng thử lại sau!`,
        threadID,
        messageID
      )
    }

    if (stateManager.has(threadID)) {
      return api.sendMessage(
        '⚠️ Đang có một quy trình dizz chạy trong nhóm này rồi. Gõ "dizz off" để dừng trước.',
        threadID,
        messageID
      )
    }

    // --- XỬ LÝ THAM SỐ SỐ LẦN (BẮT BUỘC) ---
    let targetCount
    // Lọc lấy phần tử chỉ chứa chữ số
    const numberArg = args.find((arg) => /^\d+$/.test(arg))

    if (!numberArg) {
      return api.sendMessage(
        '⚠️ Bạn chưa nhập số lần dizz!\n📝 Cú pháp: dizz [@tag] [số lần]\n💡 Ví dụ: dizz @A 20',
        threadID,
        messageID
      )
    }

    targetCount = Number.parseInt(numberArg, 10)
    // Giới hạn an toàn
    if (targetCount > CFG.MAX_LIMIT) {
      targetCount = CFG.MAX_LIMIT
    }
    if (targetCount < 1) {
      targetCount = 1
    }

    // Setup dữ liệu tag
    const name = mentions[mentionID].replace(/@/g, '')
    const arraytag = [{ id: mentionID, tag: name }]

    // --- 3. DANH SÁCH TIN NHẮN ---
    const messages = [
      'Ê con đĩ nghe cho rõ lời chuỵ nói nè !',
      {
        body: `Đã là chim cú mà còn đòi ra vẻ phượng hoàng\nChỉ là thứ chó hoang mà cứ tưởng mình là bà hoàng thiên hạ. ${name}`,
        mentions: arraytag,
      },
      {
        body: `Đã là đĩ còn ra vẻ tiến sĩ\nĐã xấu lại còn bày kiêu sa, quyền quý\nBên ngoài thì giả nai, bên trong thì giả tạo. Vậy cưng có cái gì là hàng thật không hay toàn hàng fake. ${name}`,
        mentions: arraytag,
      },
      {
        body: `Thứ chó cỏ nhà quê mà đòi ngang hàng bẹc zê thành phố\nCỏ dại ven đường thì tuổi lồn sánh vai với mây ${name}`,
        mentions: arraytag,
      },
      {
        body: `Nước rửa bồn cầu mà đòi so với nước hoa Chanel\nCứt hạng 3 mà cứ tưởng mình là socola loại 1 ${name}`,
        mentions: arraytag,
      },
      {
        body: `Sinh ra làm phận 2 chân thì đừng nên sống như lũ 4 cẳng. ${name}`,
        mentions: arraytag,
      },
      {
        body: `Ừ thì tao xấu nhưng kết cấu tao hài hòa còn đỡ hơn mày xấu từ xương chậu xấu ra\nĐến ma còn phải tránh xa khi gặp mày ăn ở bầy hầy mà cứ như sạch sẽ thân hình đầy ghẻ mà cứ tưởng hột xoàn\nĐéo đựơc đàng hoàng mà ra giọng thanh cao\nchơi xấu với tao thì tao cho phắn ra nghĩa địa ${name}`,
        mentions: arraytag,
      },
      {
        body: `Mở mồm ra chửi tao là CHÓ văn vẻ méo mó thích gây sóng gió đòi làm khó tao sao ??!\nĐừng nghĩ trình độ cao mà khiến tao lao đao chưa đủ xôn xao đâu con cáo. ${name}`,
        mentions: arraytag,
      },
      {
        body: `Sống trên đời phải biết mình là ai\nLịch sự thì không có chỉ có cái máu chơi chó thì không ai sánh bằng ${name}`,
        mentions: arraytag,
      },
      {
        body: `Nếu đã là Cáo thì đừng tập diễn thành Nai\nCòn nếu đã cố gắng diễn hơp vai thì về sau đừng lộ ra cái đuôi chồn giả tạo ${name}`,
        mentions: arraytag,
      },
      {
        body: `Mày lâu lâu lại ngu một phát, hay mà đã ngu học thường niên\nKhoe mày đã tốt nghiệp đại học mà lại cần chị giáo dục thường xuyên ${name}`,
        mentions: arraytag,
      },
      { body: `Mới có chút mà cứ tưởng mình 9 nút ${name}`, mentions: arraytag },
      { body: `Tuổi con cặc mà cứ tưởng mình con cọp ${name}`, mentions: arraytag },
      {
        body: `Dòng thứ lồn tơm lồn đậm, lồn đười ươi nó địt\nLồn con vịt nó phang, lồn giang mai lồn ỉa chảy ${name}`,
        mentions: arraytag,
      },
      { body: `Lồn nhảy hiphop, lồn hàng triệu con súc vật ${name}`, mentions: arraytag },
      { body: `Đợi chị mày xíu, chị gắn cu giả để địt con đĩ mẹ mày ${name}`, mentions: arraytag },
      { body: `Ớ ớ yamate ${name}`, mentions: arraytag },
      { body: `Xong rồi nè ${name}`, mentions: arraytag },
      {
        body: `Địt mẹ mày lất phất như mưa rơi, địt tơi bời như bom đạn\nĐịt lãng mạn như romeo và juliet ${name}`,
        mentions: arraytag,
      },
      {
        body: `Địt đứng tim phổi, địt cặp mắt nai\nĐịt chai lỗ đít, địt khít cái lỗ lồn con đĩ mẹ mày ${name}`,
        mentions: arraytag,
      },
      {
        body: `Địt như mấy con điếm bên chợ đồng xuân, địt đằng chân mà lên đằng đầu ${name}`,
        mentions: arraytag,
      },
      'Địt sập cầu, sập cống',
      { body: `Địt rớt xuống sông rồi địt xuống âm phủ ${name}`, mentions: arraytag },
      { body: `Để cho mày đầu thai ${name}`, mentions: arraytag },
      { body: `Hoá kiếp con chó như mày từng mong ước ${name}`, mentions: arraytag },
      'Chửi ít hiểu nhe nghe hum con ôn lồn',
    ]

    // --- 4. BẮT ĐẦU CHẠY (ASYNC LOOP) ---
    stateManager.set(threadID, true) // Đánh dấu đang chạy
    api.sendMessage(
      `🚀 Bắt đầu dizz: ${name} (${targetCount} lần)\n🛑 Để dừng hãy gõ: dizz off`,
      threadID,
      messageID
    )

    // Vòng lặp xử lý theo số lần yêu cầu (targetCount)
    for (let i = 0; i < targetCount; i++) {
      // 1. Kiểm tra xem có lệnh dừng không
      if (!stateManager.has(threadID)) {
        break // Thoát vòng lặp ngay lập tức
      }

      // 2. Lấy câu dizz hiện tại (dùng % để xoay vòng nếu targetCount > số câu trong mảng)
      const msg = messages[i % messages.length]

      // 3. Chuẩn bị nội dung gửi
      const messageToSend =
        typeof msg === 'string' ? { body: msg } : { body: msg.body, mentions: msg.mentions || [] }

      // 4. Gửi tin nhắn
      try {
        await api.sendMessage(messageToSend, threadID)
      } catch (err) {
        console.error(`[Dizz] Lỗi gửi tin: ${err.message}`)
        // Nếu lỗi nặng (như bị chặn spam), tự động dừng
        if (err.errorSummary?.includes('limit') || err.errorSummary?.includes('spam')) {
          stateManager.delete(threadID)
          api.sendMessage('⚠️ Đã dừng do phát hiện nghi vấn Spam từ Facebook.', threadID)
          break
        }
      }

      // 5. Nghỉ ngẫu nhiên
      if (i < targetCount - 1 && stateManager.has(threadID)) {
        await delay(getRandomDelay())
      }
    }

    // Hoàn thành vòng lặp
    if (stateManager.has(threadID)) {
      stateManager.delete(threadID)
      api.sendMessage(`✅ Đã hoàn thành ${targetCount} câu dizz.`, threadID)
    }
  } catch (error) {
    console.error('Lỗi ngoại lệ dizz:', error)
    if (event.threadID) {
      stateManager.delete(event.threadID)
    }
    api.sendMessage('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.', threadID, messageID)
  }
}
