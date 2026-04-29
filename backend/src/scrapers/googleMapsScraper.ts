import { chromium, Browser, Page } from 'playwright';
import { extractEmailsFromWebsite } from './emailExtractor';

export interface ScrapedLead {
  businessName: string;
  phone?: string;
  website?: string;
  emails?: string[];
  address?: string;
  category?: string;
  rating?: number;
  sourceUrl?: string;
}

export class GoogleMapsScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrape(keyword: string, location: string, limit: number = 20): Promise<ScrapedLead[]> {
    if (!this.page) await this.init();
    
    const leads: ScrapedLead[] = [];
    const query = encodeURIComponent(`${keyword} in ${location}`);
    const url = `https://www.google.com/maps/search/${query}`;
    
    console.log(`Navigating to ${url}`);
    await this.page!.goto(url, { waitUntil: 'networkidle' });

    // Wait for the results panel
    try {
      await this.page!.waitForSelector('div[role="feed"]', { timeout: 10000 });
    } catch (e) {
      console.log('No results found or timed out');
      return leads;
    }

    let previousHeight = 0;
    while (leads.length < limit) {
      const elements = await this.page!.$$('div.Nv254.hq6HRb.WNBkOb.aZ62vd'); // Wait, Maps selectors change frequently. 
      // Using generic a tags that represent listings is safer:
      const links = await this.page!.$$('a[href*="/maps/place/"]');
      
      for (const link of links) {
        if (leads.length >= limit) break;
        
        try {
          await link.click();
          await this.page!.waitForTimeout(2000); // Human-like delay
          
          // Scrape details from the expanded side panel
          const businessName = await this.page!.locator('h1.DUwDvf').innerText().catch(() => '');
          if (!businessName) continue;
          
          const website = await this.page!.locator('a[data-item-id="authority"]').getAttribute('href').catch(() => '');
          const phone = await this.page!.locator('button[data-tooltip="Copy phone number"]').innerText().catch(() => '');
          const address = await this.page!.locator('button[data-tooltip="Copy address"]').innerText().catch(() => '');
          const category = await this.page!.locator('button.DkEaL').first().innerText().catch(() => '');
          
          // Only add if not already in list
          if (!leads.find(l => l.businessName === businessName)) {
            const lead: ScrapedLead = {
              businessName,
              phone: phone || undefined,
              website: website || undefined,
              address: address || undefined,
              category: category || undefined,
              sourceUrl: this.page!.url(),
              emails: []
            };

            // Optional: extract email from website
            if (lead.website) {
              lead.emails = await extractEmailsFromWebsite(lead.website);
            }

            leads.push(lead);
            console.log(`Scraped: ${businessName}`);
          }
        } catch (e) {
          console.error('Error scraping individual map listing', e);
        }
      }

      // Scroll feed
      const feed = await this.page!.$('div[role="feed"]');
      if (feed) {
        await feed.evaluate((node) => node.scrollBy(0, 5000));
        await this.page!.waitForTimeout(2000);
      }
      
      // Safety check to avoid infinite loops if no more results load
      const currentHeight = await feed?.evaluate((node) => node.scrollHeight) || 0;
      if (currentHeight === previousHeight) break; // Reached bottom
      previousHeight = currentHeight;
    }

    return leads;
  }
}
