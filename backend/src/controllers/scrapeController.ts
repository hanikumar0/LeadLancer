import { Request, Response } from 'express';
import ScrapeJob from '../models/ScrapeJob';
import Lead from '../models/Lead';
import { GoogleMapsScraper } from '../scrapers/googleMapsScraper';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const startScrape = async (req: AuthRequest, res: Response) => {
  const { keyword, city, source } = req.body;

  if (!keyword || !city) {
    return res.status(400).json(createResponse(false, 'Keyword and city are required'));
  }

  try {
    const job = await ScrapeJob.create({
      userId: req.user._id,
      keyword,
      location: city,
      source,
      status: 'Running'
    });

    res.status(202).json(createResponse(true, 'Scraping started', { jobId: job._id }));

    // Run scraper asynchronously
    runScraperInBackground((job._id as any).toString(), req.user._id.toString(), keyword, city, source);

  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to start job'));
  }
};

const runScraperInBackground = async (jobId: string, userId: string, keyword: string, city: string, source: string) => {
  try {
    if (source === 'google-maps') {
      const scraper = new GoogleMapsScraper();
      const scrapedData = await scraper.scrape(keyword, city, 10); // Limit 10 for MVP speed
      await scraper.close();

      let successCount = 0;
      let failedCount = 0;

      for (const data of scrapedData) {
        try {
          const orConditions: any[] = [{ businessName: data.businessName, city: city }];
          if (data.phone) orConditions.push({ phone: data.phone });
          if (data.website) orConditions.push({ website: data.website });

          // Check for duplicate based on phone or website, or businessName + city
          const existing = await Lead.findOne({ $or: orConditions });

          if (existing) {
            // Update existing
            existing.phone = data.phone || existing.phone;
            existing.website = data.website || existing.website;
            if (data.emails && data.emails.length > 0 && !existing.email) {
              existing.email = data.emails[0];
            }
            await existing.save();
            successCount++;
          } else {
            // Create new
            await Lead.create({
              userId,
              businessName: data.businessName,
              city,
              niche: keyword,
              source: source,
              phone: data.phone,
              website: data.website,
              email: data.emails && data.emails.length > 0 ? data.emails[0] : undefined,
              sourceUrl: data.sourceUrl
            });
            successCount++;
          }
        } catch (e) {
          failedCount++;
        }
      }

      await ScrapeJob.findByIdAndUpdate(jobId, {
        status: 'Completed',
        totalFound: scrapedData.length,
        successCount,
        failedCount,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Scraper background error:', error);
    await ScrapeJob.findByIdAndUpdate(jobId, { status: 'Failed', completedAt: new Date() });
  }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await ScrapeJob.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(createResponse(true, 'Jobs fetched', jobs));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch jobs'));
  }
};
