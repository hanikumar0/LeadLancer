import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import Lead from '../models/Lead';
import { calculateScores } from './scoringEngine';

export const runAudit = async (leadId: string) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new Error('Lead not found');

  lead.auditStatus = 'running';
  await lead.save();

  try {
    if (!lead.website) {
      // Score immediately based on no website
      const scores = calculateScores({}, lead);
      Object.assign(lead, scores);
      lead.auditStatus = 'completed';
      lead.lastAuditedAt = new Date();
      await lead.save();
      return lead;
    }

    let url = lead.website;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const startTime = Date.now();
    let isHttps = url.startsWith('https');
    
    let html = '';
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      html = await page.content();
      if (response) {
        isHttps = response.url().startsWith('https');
      }
    } catch (e) {
      // Failed to load
      await browser.close();
      const scores = calculateScores({
        isHttps: false,
        hasTitle: false,
        hasH1: false,
        hasMetaDescription: false,
        isMobileResponsive: false,
        hasContactForm: false,
        hasCTA: false,
        brokenImages: 0,
        hasSocialLinks: false,
        loadTimeMs: 10000
      }, lead);
      Object.assign(lead, scores);
      lead.issues.push('Website failed to load or is offline');
      lead.auditStatus = 'completed';
      lead.lastAuditedAt = new Date();
      await lead.save();
      return lead;
    }

    const loadTimeMs = Date.now() - startTime;
    const $ = cheerio.load(html);

    const auditData = {
      isHttps,
      loadTimeMs,
      hasTitle: $('title').length > 0 && $('title').text().length > 5,
      hasH1: $('h1').length > 0,
      hasMetaDescription: $('meta[name="description"]').length > 0,
      isMobileResponsive: $('meta[name="viewport"]').length > 0,
      hasContactForm: $('form').length > 0 || $('input[type="email"]').length > 0,
      hasCTA: $('a, button').toArray().some(el => {
        const text = $(el).text().toLowerCase();
        return text.includes('buy') || text.includes('book') || text.includes('contact') || text.includes('get started');
      }),
      brokenImages: 0, // Placeholder
      hasSocialLinks: $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="twitter.com"], a[href*="linkedin.com"]').length > 0
    };

    await browser.close();

    const scores = calculateScores(auditData, lead);
    Object.assign(lead, scores);
    lead.auditStatus = 'completed';
    lead.lastAuditedAt = new Date();
    await lead.save();

    return lead;

  } catch (error) {
    console.error(`Audit failed for lead ${leadId}`, error);
    lead.auditStatus = 'failed';
    await lead.save();
    throw error;
  }
};
