"use client";

import { useState, useEffect } from 'react';
import { leadService } from '@/lib/scrapeService';
import { communicationService } from '@/lib/communicationService';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export default function InboxPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Get leads with contact info
      const res = await leadService.getLeads({ limit: 50 });
      setLeads(res.data.leads.filter((l: any) => l.email || l.phone || l.whatsappNumber));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const selectLead = async (lead: any) => {
    setSelectedLead(lead);
    try {
      const res = await communicationService.getLeadCommunications(lead._id);
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsApp = async () => {
    if (!selectedLead) return;
    try {
      const res = await communicationService.getWhatsAppLink({ leadId: selectedLead._id });
      // Open WhatsApp
      window.open(res.data.link, '_blank');
      
      // Log it
      await communicationService.logCommunication({
        leadId: selectedLead._id,
        channel: 'whatsapp',
        direction: 'outbound',
        message: res.data.message
      });
      
      selectLead(selectedLead); // refresh history
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to open WhatsApp');
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Leads List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-lg bg-gray-50">Contacts</div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading contacts...</div>
          ) : leads.map(lead => (
            <div 
              key={lead._id} 
              onClick={() => selectLead(lead)}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${selectedLead?._id === lead._id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="font-semibold">{lead.businessName}</div>
              <div className="text-xs text-gray-500 mt-1 flex gap-2">
                {lead.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {lead.phone}</span>}
                {lead.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1"/> {lead.email}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {selectedLead ? (
          <>
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">{selectedLead.businessName}</h3>
                <div className="text-sm text-gray-500">{selectedLead.niche} • {selectedLead.city}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Now
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Communication Timeline</h4>
              {history.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No communication logged yet. Break the ice!</div>
              ) : (
                <div className="space-y-4">
                  {history.map(log => (
                    <div key={log._id} className={`flex ${log.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-xl p-4 ${log.direction === 'outbound' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                        <div className="text-xs opacity-70 mb-1 flex justify-between">
                          <span className="uppercase">{log.channel}</span>
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-sm">{log.message}</div>
                        <div className="text-right text-[10px] opacity-50 mt-2">{log.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a contact to view timeline</p>
          </div>
        )}
      </div>
    </div>
  );
}
