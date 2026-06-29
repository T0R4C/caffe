import puppeteer from 'puppeteer';

/**
 * Wait for X milliseconds (rate limiting).
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Launch puppeteer browser instance.
 * @returns {Promise<puppeteer.Browser>}
 */
export async function launchBrowser() {
  console.log('  🌐 Launching Puppeteer browser...');
  return await puppeteer.launch({
    headless: 'new', // use new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

/**
 * Close puppeteer browser instance.
 * @param {puppeteer.Browser} browser
 */
export async function closeBrowser(browser) {
  if (browser) {
    console.log('  🌐 Closing Puppeteer browser...');
    await browser.close();
  }
}

/**
 * Searches DuckDuckGo for the cafe's Instagram or website URL.
 * @param {puppeteer.Browser} browser 
 * @param {string} cafeName 
 * @param {string} area 
 * @returns {Promise<{instagram: string|null, website: string|null}>}
 */
export async function searchCafeWebData(browser, cafeName, area) {
  if (!browser || !cafeName) return { instagram: null, website: null };

  const page = await browser.newPage();
  const results = { instagram: null, website: null };
  
  // Set random User-Agent to avoid blocking
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

  try {
    const query = encodeURIComponent(`"${cafeName}" ${area || 'Jakarta'} instagram`);
    // DuckDuckGo lite version for faster scraping without heavy JS
    await page.goto(`https://lite.duckduckgo.com/lite/?q=${query}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Extract first few links
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a.result-url'));
      return anchors.map(a => a.href);
    });

    for (const link of links) {
      if (!results.instagram && link.includes('instagram.com/')) {
        // Simple regex to extract username from basic instagram links
        const match = link.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
        if (match && match[1] && match[1] !== 'p' && match[1] !== 'reel' && match[1] !== 'explore') {
          results.instagram = `https://instagram.com/${match[1]}`;
        }
      }
    }
  } catch (error) {
    console.warn(`  ⚠ Puppeteer search failed for ${cafeName}:`, error.message);
  } finally {
    await page.close();
  }

  // Brief delay to be polite
  await sleep(1500);

  return results;
}
