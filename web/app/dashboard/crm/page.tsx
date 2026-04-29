"use client";

import { useState, useEffect } from 'react';
import { crmService } from '@/lib/crmService';
import { leadService } from '@/lib/scrapeService';
import { Button } from '@/components/ui/button';

const STAGES = ['New Lead', 'Contacted', 'Replied', 'Qualified', 'Meeting Booked', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const fetchData = async () => {
    try {
      const leadsRes = await leadService.getLeads({ limit: 500 });
      setLeads(leadsRes.data.leads);
      const statsRes = await crmService.getStats();
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moveLead = async (leadId: string, newStage: string) => {
    // Optimistic UI update
    setLeads(leads.map(l => l._id === leadId ? { ...l, crmStage: newStage } : l));
    try {
      await crmService.updateLeadStage(leadId, newStage);
    } catch (e) {
      alert('Failed to update stage');
      fetchData(); // revert
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CRM Pipeline</h2>
        <Button onClick={fetchData} variant="outline">Refresh</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Pipeline Value</div>
          <div className="text-2xl font-bold">${stats.pipelineValue || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Won Value</div>
          <div className="text-2xl font-bold text-green-600">${stats.wonValue || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Open Deals</div>
          <div className="text-2xl font-bold text-blue-600">{stats.openDeals || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Total Leads</div>
          <div className="text-2xl font-bold">{leads.length}</div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-[600px] min-w-max">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => (l.crmStage || 'New Lead') === stage);
            
            return (
              <div key={stage} className="w-80 bg-gray-50 rounded-xl border border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gray-100/50 rounded-t-xl font-semibold flex justify-between items-center">
                  <span>{stage}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{stageLeads.length}</span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageLeads.map(lead => (
                    <div key={lead._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer">
                      <div className="font-semibold text-sm">{lead.businessName}</div>
                      {lead.email && <div className="text-xs text-gray-500 mt-1">{lead.email}</div>}
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className={`text-xs px-2 py-1 rounded-full ${lead.totalLeadScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          Score: {lead.totalLeadScore}
                        </div>
                        
                        <select 
                          value={stage} 
                          onChange={(e) => moveLead(lead._id, e.target.value)}
                          className="text-xs border rounded p-1"
                        >
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
