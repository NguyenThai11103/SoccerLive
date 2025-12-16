# Python Match Crawler

## 🎯 Mục đích

Crawler để lấy danh sách trận đấu trực tiếp từ **KeucolaTV** sử dụng Python + Selenium.

## 📦 Cài đặt

### 1. Cài Python packages

```bash
pip install -r requirements.txt
```

### 2. Cài Chrome Driver (Tự động)

Script sẽ tự động download Chrome driver phù hợp với Chrome version của bạn.

Hoặc cài thủ công:

- Download từ: https://chromedriver.chromium.org/
- Đặt vào PATH hoặc cùng folder với script

## 🚀 Sử dụng

### Chạy crawler

```bash
python match_crawler.py
```

### Headless mode (không hiện browser)

Mặc định crawler chạy với `headless=False` để bạn thấy browser.

Để chạy headless, sửa trong `main()`:

```python
with MatchCrawler(headless=True) as crawler:
```

## 📊 Output

### Console Output

```
🚀 Starting Match Crawler...

🔍 Đang crawl matches từ https://keucolatv.live/truc-tiep-bong-da...
✅ Crawled 15 matches

📊 Kết quả crawl:
Tổng số trận: 15

📋 Danh sách 5 trận đầu tiên:

1. Manchester United vs Liverpool
   Thời gian: 19:30
   URL: https://keucolatv.live/truc-tiep-bong-da/abc123/xyz789
   Match ID: abc123
```

### JSON Output

File `matches.json` sẽ được tạo với format:

```json
[
  {
    "match_id": "abc123",
    "stream_id": "xyz789",
    "url": "https://keucolatv.live/truc-tiep-bong-da/abc123/xyz789",
    "home_team": "Manchester United",
    "away_team": "Liverpool",
    "match_time": "19:30",
    "full_text": "Manchester United vs Liverpool",
    "status": "Sắp diễn ra",
    "source": "KeucolaTV",
    "crawled_at": "2025-12-16T15:00:00"
  }
]
```

## 🔧 Sử dụng trong code

```python
from match_crawler import MatchCrawler

# Crawl matches
with MatchCrawler(headless=True) as crawler:
    matches = crawler.crawl_matches()

    for match in matches:
        print(f"{match['home_team']} vs {match['away_team']}")
        print(f"URL: {match['url']}")
```

## 🔄 Tích hợp với Backend

### Option 1: Gọi Python từ Node.js

```javascript
// backend/src/utils/pythonCrawler.js
import { spawn } from "child_process";

export const crawlMatches = () => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["../crawler/match_crawler.py"]);

    let data = "";
    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        const matches = JSON.parse(data);
        resolve(matches);
      } else {
        reject(new Error("Crawler failed"));
      }
    });
  });
};
```

### Option 2: API Endpoint

Tạo Flask API trong Python:

```python
# crawler/api.py
from flask import Flask, jsonify
from match_crawler import MatchCrawler

app = Flask(__name__)

@app.route('/api/crawl', methods=['GET'])
def crawl():
    with MatchCrawler(headless=True) as crawler:
        matches = crawler.crawl_matches()
        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches)
        })

if __name__ == '__main__':
    app.run(port=5001)
```

Gọi từ Node.js:

```javascript
const response = await axios.get("http://localhost:5001/api/crawl");
const matches = response.data.data;
```

## ⚙️ Configuration

### Thay đổi timeout

```python
self.wait = WebDriverWait(self.driver, 20)  # 20 seconds
```

### Thay đổi User Agent

```python
chrome_options.add_argument("user-agent=Your Custom User Agent")
```

### Thêm proxy

```python
chrome_options.add_argument('--proxy-server=http://proxy:port')
```

## 🐛 Troubleshooting

### Lỗi: Chrome driver not found

**Giải pháp**:

```bash
pip install webdriver-manager
```

Hoặc download manual từ: https://chromedriver.chromium.org/

### Lỗi: Selenium timeout

**Giải pháp**: Tăng timeout

```python
self.wait = WebDriverWait(self.driver, 30)
```

### Lỗi: Element not found

**Giải pháp**: Website có thể đã thay đổi structure. Check lại CSS selectors.

## ✅ Ưu điểm Python Crawler

- ✅ Crawl được JavaScript-rendered content
- ✅ Dễ debug (có thể xem browser)
- ✅ Nhiều thư viện hỗ trợ
- ✅ Code ngắn gọn, dễ hiểu
- ✅ Có thể chụp screenshot, PDF

## 📝 Notes

- Crawler chạy mất ~5-10 giây tùy tốc độ mạng
- Nên chạy với interval hợp lý (mỗi 30 phút) để tránh bị chặn
- Có thể cache kết quả để giảm số lần crawl
