"""
Match Crawler for KeucolaTV
Crawl live football match links using Selenium
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import json
import time
from datetime import datetime

class MatchCrawler:
    def __init__(self, headless=True):
        """Initialize crawler with Chrome driver"""
        self.base_url = "https://st.90phut27.com"
        self.matches_url = f"{self.base_url}/home"
        
        # Setup Chrome options
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        # Initialize driver
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
    
    def crawl_matches(self):
        """Crawl all matches from the page"""
        try:
            print(f"🔍 Đang crawl matches từ {self.matches_url}...")
            
            # Navigate to page
            self.driver.get(self.matches_url)
            
            # Wait for page to load
            time.sleep(3)
            
            # Wait for match links to appear
            try:
                self.wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'a.match-link, a[href*="/truc-tiep/"]'))
                )
            except:
                print("⚠️ Không tìm thấy match links, có thể trang đang load...")
            
            # Find all match links (90phut27 uses /truc-tiep pattern)
            match_links = self.driver.find_elements(By.CSS_SELECTOR, 'a.match-link, a[href*="/truc-tiep/"]')
            
            matches = []
            seen_urls = set()
            
            for link in match_links:
                try:
                    href = link.get_attribute('href')
                    
                    # Skip if already processed or is main page
                    if not href or href in seen_urls or '/truc-tiep/' not in href:
                        continue
                    
                    seen_urls.add(href)
                    
                    # Parse URL - 90phut27 format: /truc-tiep/match-slug-id
                    path_parts = href.replace(self.base_url, '').split('/')
                    path_parts = [p for p in path_parts if p]
                    
                    # Extract match ID from URL
                    if len(path_parts) >= 2 and 'truc-tiep' in path_parts:
                        match_id = path_parts[-1]  # Last part is the match slug-id
                        stream_id = match_id  # Use same as match_id for 90phut27
                        
                        # Find parent container (div.xitem2)
                        try:
                            parent = link.find_element(By.XPATH, './ancestor::div[contains(@class, "xitem2")]')
                        except:
                            # Fallback to any parent div
                            try:
                                parent = link.find_element(By.XPATH, './parent::div')
                            except:
                                parent = link
                        
                        # Extract team names from span.team-home .name and span.team-away .name
                        home_team = ''
                        away_team = ''
                        try:
                            home_team_elem = parent.find_element(By.CSS_SELECTOR, 'span.team-home .name')
                            home_team = home_team_elem.text.strip()
                        except:
                            pass
                        
                        try:
                            away_team_elem = parent.find_element(By.CSS_SELECTOR, 'span.team-away .name')
                            away_team = away_team_elem.text.strip()
                        except:
                            pass
                        
                        # Extract match time from span.xtime b
                        match_time = ''
                        try:
                            time_elem = parent.find_element(By.CSS_SELECTOR, 'span.xtime b')
                            match_time = time_elem.text.strip()
                        except:
                            pass
                        
                        # Extract status from span.xstatus or span.match-status
                        status = 'Sắp diễn ra'
                        try:
                            status_elem = parent.find_element(By.CSS_SELECTOR, 'span.xstatus')
                            status_text = status_elem.text.strip()
                            if 'Live' in status_text or 'live' in status_text:
                                status = 'Đang diễn ra'
                            elif status_text:
                                status = status_text
                        except:
                            try:
                                status_elem = parent.find_element(By.CSS_SELECTOR, 'span.match-status')
                                status_text = status_elem.text.strip()
                                if status_text:
                                    status = 'Đang diễn ra'  # If match-status exists, it's usually live
                            except:
                                pass
                        
                        match_data = {
                            'match_id': match_id,
                            'stream_id': stream_id,
                            'url': href,
                            'home_team': home_team,
                            'away_team': away_team,
                            'match_time': match_time,
                            'full_text': f"{home_team} vs {away_team}",
                            'status': status,
                            'source': '90phut27',
                            'crawled_at': datetime.now().isoformat()
                        }
                        
                        matches.append(match_data)
                        
                except Exception as e:
                    print(f"⚠️ Lỗi khi parse link: {e}")
                    continue
            
            print(f"✅ Crawled {len(matches)} matches")
            return matches
            
        except Exception as e:
            print(f"❌ Lỗi khi crawl: {e}")
            raise
    
    def crawl_match_detail(self, match_url):
        """Crawl detail of a specific match"""
        try:
            print(f"🔍 Crawling match detail: {match_url}")
            
            self.driver.get(match_url)
            time.sleep(3)
            
            # Find iframe sources (stream URLs)
            iframes = self.driver.find_elements(By.TAG_NAME, 'iframe')
            stream_urls = []
            
            for iframe in iframes:
                src = iframe.get_attribute('src')
                if src:
                    stream_urls.append(src)
            
            # Find video sources
            videos = self.driver.find_elements(By.TAG_NAME, 'video')
            for video in videos:
                sources = video.find_elements(By.TAG_NAME, 'source')
                for source in sources:
                    src = source.get_attribute('src')
                    if src:
                        stream_urls.append(src)
            
            return {
                'url': match_url,
                'stream_urls': stream_urls,
                'crawled_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"❌ Lỗi khi crawl match detail: {e}")
            raise
    
    def save_to_json(self, matches, filename='matches.json'):
        """Save matches to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(matches, f, ensure_ascii=False, indent=2)
        print(f"💾 Đã lưu {len(matches)} matches vào {filename}")
    
    def close(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            print("🔒 Đã đóng browser")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def main():
    """Main function to test crawler"""
    print("🚀 Starting Match Crawler...\n")
    
    # Use context manager to auto-close browser
    with MatchCrawler(headless=False) as crawler:
        # Crawl matches
        matches = crawler.crawl_matches()
        
        # Print results
        print(f"\n📊 Kết quả crawl:")
        print(f"Tổng số trận: {len(matches)}\n")
        
        if matches:
            print("📋 Danh sách 5 trận đầu tiên:")
            for i, match in enumerate(matches[:5], 1):
                print(f"\n{i}. {match['home_team']} vs {match['away_team']}")
                print(f"   Thời gian: {match['match_time']}")
                print(f"   URL: {match['url']}")
                print(f"   Match ID: {match['match_id']}")
            
            # Save to JSON
            crawler.save_to_json(matches)
        else:
            print("⚠️ Không tìm thấy matches nào")
    
    print("\n✅ Crawler completed!")


if __name__ == "__main__":
    main()
