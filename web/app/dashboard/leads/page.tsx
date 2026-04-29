"use client";

import { useState, useEffect } from 'react';
import { leadService } from '@/lib/scrapeService';
import { auditService } from '@/lib/auditService';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Globe, Activity } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads();
      setLeads(res.data.leads);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAudit = async (leadId: string) => {
    try {
      await auditService.startAudit(leadId);
      alert('Audit queued!');
      fetchLeads();
    } catch (e) {
      alert('Error queueing audit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Leads</h2>
        <div className="space-x-3">
          <Button onClick={() => {
            auditService.startBulkAudit().then(() => {
              alert('Bulk audit queued for up to 5 leads');
              fetchLeads();
            });
          }} variant="secondary">Bulk Audit 5 Leads</Button>
          <Button onClick={fetchLeads} variant="outline">Refresh</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No leads found. Start scraping!</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-500">
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Lead Score</th>
                <th className="p-4 font-medium">Status / Audit</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{lead.businessName}</div>
                    <div className="text-xs text-gray-500 mt-1">{lead.niche}</div>
                  </td>
                  <td className="p-4 text-gray-600">{lead.city}</td>
                  <td className="p-4 space-y-1">
                    {lead.email && <div className="flex items-center gap-1 text-gray-600"><Mail className="w-3 h-3"/> {lead.email}</div>}
                    {lead.phone && <div className="flex items-center gap-1 text-gray-600"><Phone className="w-3 h-3"/> {lead.phone}</div>}
                    {lead.website && <div className="flex items-center gap-1 text-blue-600"><Globe className="w-3 h-3"/> <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline">Website</a></div>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${lead.totalLeadScore >= 80 ? 'bg-green-500' : lead.totalLeadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {lead.totalLeadScore}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        Buy Intent: {lead.buyIntentScore}<br/>
                        {lead.website && `Site Health: ${lead.websiteHealthScore}`}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs block mb-2 w-max">{lead.status}</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs block w-max">Audit: {lead.auditStatus}</span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAudit(lead._id)}><Activity className="w-4 h-4 mr-1"/> Audit</Button>
                    <Button variant="ghost" size="sm">Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
