"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { scrapeService } from '@/lib/scrapeService';

export default function FinderPage() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [source, setSource] = useState('google-maps');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await scrapeService.getJobs();
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5s for updates
    return () => clearInterval(interval);
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scrapeService.startScrape({ keyword, city, source });
      setKeyword('');
      setCity('');
      fetchJobs();
    } catch (error) {
      alert('Failed to start scrape job');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lead Finder</h2>
      
      <form onSubmit={handleStart} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Keyword (e.g. Dentist)</label>
          <Input required value={keyword} onChange={e => setKeyword(e.target.value)} className="mt-1" />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">City / Location</label>
          <Input required value={city} onChange={e => setCity(e.target.value)} className="mt-1" />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Source</label>
          <select value={source} onChange={e => setSource(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-gray-300 bg-background px-3 text-sm">
            <option value="google-maps">Google Maps</option>
            <option value="justdial">Justdial</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Starting...' : 'Start Scrape'}</Button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
        {jobs.length === 0 ? (
          <div className="text-gray-500">No scraping jobs yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-2">Keyword</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Found</th>
                <th className="pb-2">Success</th>
                <th className="pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{job.keyword}</td>
                  <td className="py-3">{job.location}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'Running' ? 'bg-blue-100 text-blue-700' : job.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3">{job.totalFound}</td>
                  <td className="py-3">{job.successCount}</td>
                  <td className="py-3 text-gray-500">{new Date(job.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
