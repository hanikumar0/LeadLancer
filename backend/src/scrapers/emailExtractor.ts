import axios from 'axios';
import * as cheerio from 'cheerio';

const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
const EXCLUDED_EMAILS = ['example@', 'noreply@', 'no-reply@', 'test@', 'sentry@'];

export const extractEmailsFromWebsite = async (url: string): Promise<string[]> => {
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // Visit homepage
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);
    
    let emails: string[] = [];
    
    // Extract from mailto links
    $('a[href^="mailto:"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        emails.push(href.replace('mailto:', '').split('?')[0].trim());
      }
    });

    // Extract from raw text
    const textEmails = html.match(EMAIL_REGEX) || [];
    emails = [...emails, ...textEmails];

    // Filter and deduplicate
    emails = [...new Set(emails.map(e => e.toLowerCase()))];
    emails = emails.filter(e => {
      if (e.endsWith('.png') || e.endsWith('.jpg') || e.endsWith('.jpeg') || e.endsWith('.gif')) return false;
      if (EXCLUDED_EMAILS.some(excluded => e.includes(excluded))) return false;
      return true;
    });

    return emails;
  } catch (error) {
    console.error(`Failed to extract emails from ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};
