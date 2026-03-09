# Deploy Telegram Bot lên Oracle Cloud (Free Forever)

> Hướng dẫn deploy bot Telegram lên Oracle Cloud Free Tier.
> Push code trên VS Code → bot tự cập nhật trên server, không downtime.

---

## Tổng quan

```
VS Code (code) → git push → GitHub → Server tự pull + restart → Bot chạy bản mới
```

- **Chi phí:** FREE vĩnh viễn
- **Server:** Oracle Cloud Always Free (ARM, 1 CPU, 6GB RAM)
- **Auto deploy:** GitHub Webhook + script tự động
- **Không downtime:** pm2 quản lý process

---

## Phần 1: Đăng ký Oracle Cloud

### 1.1 Tạo tài khoản

1. Vào https://cloud.oracle.com → **Sign Up for Free**
2. Điền email, tên, quốc gia
3. Xác minh bằng **thẻ Visa/Mastercard** (KHÔNG bị trừ tiền, chỉ xác minh)
4. Chọn **Home Region**: `Singapore` hoặc `Japan (Tokyo)` — gần VN, ping thấp
5. Chờ email xác nhận (thường 5-10 phút)

### 1.2 Tạo VPS (Compute Instance)

1. Đăng nhập → Menu ☰ → **Compute** → **Instances** → **Create Instance**
2. Cấu hình:
   - **Name:** `telegram-bot`
   - **Image:** Ubuntu 22.04 (hoặc 24.04)
   - **Shape:** Nhấn **Change Shape** → **Ampere** → `VM.Standard.A1.Flex`
     - OCPU: **1**
     - Memory: **6 GB**
     - (Đây là cấu hình Always Free, không mất tiền)
   - **Networking:** Để mặc định (tạo VCN mới)
   - **SSH Key:** Chọn **Generate a key pair** → **Save Private Key** (tải file `.key` về máy)
     - LƯU FILE NÀY CẨN THẬN, mất là không SSH được vào server
3. Nhấn **Create** → Chờ 2-3 phút cho instance Running
4. Copy **Public IP Address** (dạng `xxx.xxx.xxx.xxx`)

### 1.3 Mở port (Security List)

1. Trong trang instance → **Subnet** → **Security Lists** → Click vào security list
2. **Add Ingress Rules:**
   - Source CIDR: `0.0.0.0/0`
   - Destination Port: `3000` (cho webhook nếu cần sau này)
3. Nhấn **Add**

---

## Phần 2: SSH vào Server

### 2.1 Từ Mac Terminal

```bash
# Di chuyển SSH key về thư mục chuẩn
mv ~/Downloads/ssh-key-*.key ~/.ssh/oracle-bot.key
chmod 400 ~/.ssh/oracle-bot.key

# SSH vào server (thay IP_SERVER bằng Public IP ở trên)
ssh -i ~/.ssh/oracle-bot.key ubuntu@IP_SERVER
```

### 2.2 Nếu bị lỗi "Permission denied"

```bash
chmod 400 ~/.ssh/oracle-bot.key
```

---

## Phần 3: Cài đặt môi trường trên Server

Chạy lần lượt từng lệnh sau trên server (sau khi SSH vào):

### 3.1 Cập nhật hệ thống

```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Cài Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Kiểm tra: v20.x.x
npm -v
```

### 3.3 Cài Git + PM2

```bash
sudo apt install -y git
sudo npm install -g pm2
```

### 3.4 Clone repo + cài dependencies

```bash
cd ~
git clone https://github.com/nguynbon03/XuongMedia.git telegram-bot
cd telegram-bot
npm install
```

### 3.5 Tạo file .env

```bash
nano .env
```

Paste nội dung (thay bằng giá trị thật của bạn):

```
TOKEN_BOT=your_telegram_bot_token_here
# Thêm các biến khác nếu có
```

Nhấn `Ctrl+X` → `Y` → `Enter` để lưu.

### 3.6 Chạy bot với PM2

```bash
pm2 start src/index.js --name "telegram-bot"
pm2 save
pm2 startup  # Để bot tự khởi động khi server reboot
# Chạy lệnh mà pm2 in ra (sudo env PATH=...)
```

### 3.7 Kiểm tra bot

```bash
pm2 status        # Xem trạng thái
pm2 logs           # Xem log real-time (Ctrl+C để thoát)
```

Mở Telegram, nhắn bot thử → Nếu bot phản hồi = thành công!

---

## Phần 4: Auto Deploy (Push code → Bot tự cập nhật)

### 4.1 Tạo script deploy trên server

```bash
nano ~/deploy.sh
```

Paste nội dung:

```bash
#!/bin/bash
cd ~/telegram-bot
git pull origin main
npm install --production
pm2 restart telegram-bot
echo "Deploy completed at $(date)"
```

Lưu và cấp quyền:

```bash
chmod +x ~/deploy.sh
```

### 4.2 Setup Webhook listener (auto deploy khi push)

Cài webhook tool:

```bash
sudo apt install -y webhook
```

Tạo config:

```bash
mkdir -p ~/webhook
nano ~/webhook/hooks.json
```

Paste:

```json
[
  {
    "id": "deploy",
    "execute-command": "/home/ubuntu/deploy.sh",
    "command-working-directory": "/home/ubuntu/telegram-bot",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "YOUR_WEBHOOK_SECRET",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
```

> Thay `YOUR_WEBHOOK_SECRET` bằng một chuỗi bí mật bất kỳ (ví dụ: `mysecret123xyz`)

Chạy webhook listener bằng PM2:

```bash
pm2 start webhook -- -hooks ~/webhook/hooks.json -port 3000 -verbose
pm2 save
```

### 4.3 Cấu hình GitHub Webhook

1. Vào GitHub repo: https://github.com/nguynbon03/XuongMedia
2. **Settings** → **Webhooks** → **Add webhook**
3. Điền:
   - **Payload URL:** `http://IP_SERVER:3000/hooks/deploy`
   - **Content type:** `application/json`
   - **Secret:** Chuỗi bí mật đã đặt ở trên (`YOUR_WEBHOOK_SECRET`)
   - **Events:** Chọn **Just the push event**
4. Nhấn **Add webhook**

### 4.4 Test auto deploy

Trên máy Mac (VS Code):

```bash
# Sửa code gì đó, rồi:
git add .
git commit -m "test auto deploy"
git push
```

Kiểm tra trên server:

```bash
pm2 logs  # Sẽ thấy bot restart với code mới
```

---

## Phần 5: Các lệnh thường dùng

### Trên server (SSH vào)

```bash
pm2 status                 # Xem trạng thái bot
pm2 logs                   # Xem log
pm2 restart telegram-bot   # Restart thủ công
pm2 stop telegram-bot      # Dừng bot
pm2 monit                  # Monitor CPU/RAM
```

### Trên máy Mac (VS Code Terminal)

```bash
# Quy trình cập nhật bot:
git add .
git commit -m "mô tả thay đổi"
git push
# → Bot tự cập nhật trên server!
```

### Deploy thủ công (nếu webhook chưa setup)

```bash
ssh -i ~/.ssh/oracle-bot.key ubuntu@IP_SERVER
cd ~/telegram-bot
git pull
npm install
pm2 restart telegram-bot
```

---

## Tóm tắt

| Bước | Việc cần làm | Thời gian |
|------|-------------|-----------|
| 1 | Đăng ký Oracle Cloud | 10 phút |
| 2 | Tạo VPS instance | 5 phút |
| 3 | SSH + cài Node, PM2, clone repo | 10 phút |
| 4 | Tạo .env + chạy bot | 5 phút |
| 5 | Setup auto deploy (webhook) | 10 phút |
| **Tổng** | | **~40 phút** |

Sau khi setup xong, workflow hàng ngày chỉ là:
```
Sửa code → git push → Bot tự cập nhật
```
