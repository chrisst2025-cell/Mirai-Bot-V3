<div align="center">

```
███╗   ███╗██╗██████╗  █████╗ ██╗            ██████╗  ██████╗ ████████╗            ██╗   ██╗██████╗ 
████╗ ████║██║██╔══██╗██╔══██╗██║            ██╔══██╗██╔═══██╗╚══██╔══╝            ██║   ██║╚════██╗
██╔████╔██║██║██████╔╝███████║██║   █████╗   ██████╔╝██║   ██║   ██║      █████╗   ██║   ██║ █████╔╝
██║╚██╔╝██║██║██╔══██╗██╔══██║██║   ╚════╝   ██╔══██╗██║   ██║   ██║      ╚════╝   ╚██╗ ██╔╝ ╚═══██╗
██║ ╚═╝ ██║██║██║  ██║██║  ██║██║            ██████╔╝╚██████╔╝   ██║               ╚████╔╝ ██████╔╝
╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝            ╚═════╝  ╚═════╝    ╚═╝                ╚═══╝  ╚═════╝ 
```

### ✦ Messenger Chatbot Framework — Unofficial ✦

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20.x-43853d?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/dist/v20.17.0)
[![Version](https://img.shields.io/badge/version-3.0.0-blueviolet?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DongDev-VN/Mirai-Bot-V3)
[![License](https://img.shields.io/badge/license-GPL--3.0-22c55e?style=for-the-badge)](LICENSE)
[![Commits](https://img.shields.io/github/commit-activity/m/DongDev-VN/Mirai-Bot-V3?style=for-the-badge&color=f59e0b&label=commits)](https://github.com/DongDev-VN/Mirai-Bot-V3/commits)
[![Size](https://img.shields.io/github/repo-size/DongDev-VN/Mirai-Bot-V3?style=for-the-badge&color=3b82f6)](https://github.com/DongDev-VN/Mirai-Bot-V3)

<br/>

> *Một framework chatbot Messenger đơn giản, mạnh mẽ và dễ mở rộng*  
> *Built on top of Mirai-V2 · Maintained by DongDev*

<br/>

</div>

---

## 🌟 Giới thiệu

**Mirai Bot V3 Unofficial** là dự án được **DongDev** tiếp tục phát triển từ nền tảng **Mirai-V2** của *Catalizcs* và *SpermLord*, được mod lại bởi **Vuiz**.

Framework cung cấp nền tảng vững chắc để xây dựng chatbot Messenger với hệ thống module linh hoạt, hỗ trợ AI (Gemini), phát nhạc, quản lý nhóm và nhiều tính năng khác.

---

## 📋 Yêu cầu hệ thống

| Yêu cầu | Chi tiết |
|---|---|
| 💾 Dung lượng trống | Tối thiểu **1–2 GB** |
| ⚙️ Runtime | **Node.js v20.x** |
| 📝 Text editor | [Notepad++](https://notepad-plus-plus.org/) hoặc [Sublime Text 3](https://www.sublimetext.com/3) |
| 🧠 Kiến thức | Cơ bản về Node.js & JavaScript |
| 🤖 Tài khoản Facebook | Nên dùng tài khoản phụ để tránh rủi ro |

<details>
<summary><b>Yêu cầu theo nền tảng</b></summary>

<br/>

| Nền tảng | Yêu cầu thêm |
|---|---|
| 🪟 Windows | `windows-build-tools` |
| 🐧 Linux | `python3` hoặc `python2` |
| 📱 Android | [Termux](https://termux.dev/) |

</details>

---

## 🚀 Cài đặt

### Bước 1 — Chuẩn bị môi trường

Tải và cài đặt [Node.js](https://nodejs.org/en/) và [Git](https://git-scm.com/).

### Bước 2 — Clone source code

```sh
git clone https://github.com/vuinguyen16003069/Mirai-Bot-V3.git
cd Mirai-Bot-V3
```

### Bước 3 — Cài đặt dependencies

```sh
npm install
```

### Bước 4 — Cấu hình bot

Mở `config.json` và chỉnh sửa thông tin:

```json
{
  "bot": {
    "name": "Tên bot của bạn",
    "adminID": ["your_admin_id_here"]
  }
}
```

### Bước 5 — Lấy cookie Facebook

1. Đăng nhập Facebook trên trình duyệt
2. Mở DevTools (F12) → tab **Network** hoặc dùng extension
3. Sao chép cookie và lưu vào `cookie.txt`

> ⚠️ **Khuyến nghị:** Dùng tài khoản phụ để tránh bị khoá tài khoản chính.

### Bước 6 — Cấu hình Gemini AI *(tuỳ chọn)*

1. Truy cập [Google AI Studio](https://aistudio.google.com/) để lấy API Key miễn phí
2. Mở file lệnh AI (`modules/commands/goibot.js`) và điền key:

```js
const API_KEYS = [
  "AIzaSyYourFirstKey...",
  "AIzaSyYourSecondKey...",  // Thêm nhiều key để tránh giới hạn rate
];
```

### Bước 7 — Khởi chạy 🎉

```sh
npm start
```

Đợi bot load xong và tận hưởng!

---

## 📁 Cấu trúc thư mục

```
Mirai-Bot-V3/
├── 📂 modules/
│   ├── 📂 commands/       ← Các lệnh bot
│   └── 📂 events/         ← Xử lý sự kiện
├── 📂 data/               ← Dữ liệu runtime
├── 📄 config.json         ← Cấu hình chính
├── 📄 cookie.txt          ← Cookie đăng nhập
├── 📄 index.js            ← Entry point
└── 📄 package.json
```

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh và trân trọng! 💙

```
1. Fork repo này
2. Tạo branch mới       git checkout -b feature/TinhNangCuaBan
3. Commit thay đổi      git commit -m 'feat: thêm tính năng X'
4. Push lên branch      git push origin feature/TinhNangCuaBan
5. Mở Pull Request 🎉
```

---

## ☎️ Liên hệ

<div align="center">

**DongDev**

[![Facebook](https://img.shields.io/badge/Facebook-1877f2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/minhdong.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DongDev-VN)
[![Email](https://img.shields.io/badge/Email-ea4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dongdz.user@gmail.com)

<br/>

---

<sub>Made with ❤️ by DongDev · GPL-3.0 License</sub>

</div>
