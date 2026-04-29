"use client";

import { useState, useEffect } from 'react';
import { outreachService } from '@/lib/outreachService';
import { leadService } from '@/lib/scrapeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OutreachPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    leadService.getLeads({ limit: 100 }).then(res => setLeads(res.data.leads));
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    outreachService.getLogs().then(res => setLogs(res.data));
  };

  const handleGenerateAI = async () => {
    if (!selectedLead) return alert('Select a lead first');
    setLoadingAi(true);
    try {
      const res = await outreachService.generateAiEmail({ leadId: selectedLead });
      setSubject(res.data.subject);
      setBody(res.data.body);
    } catch (e) {
      alert('Error generating AI email. Ensure OpenAI key is valid.');
    }
    setLoadingAi(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await outreachService.sendEmail({ leadId: selectedLead, subject, body });
      alert('Email Sent Successfully!');
      setSubject('');
      setBody('');
      fetchLogs();
    } catch (e) {
      alert('Failed to send email. Check Resend API Key.');
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Outreach Campaigns</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Compose Email</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Select Lead</label>
              <select required value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-gray-300 px-3 text-sm">
                <option value="">-- Choose a contactable lead --</option>
                {leads.filter(l => l.email).map(lead => (
                  <option key={lead._id} value={lead._id}>{lead.businessName} ({lead.email})</option>
                ))}
              </select>
            </div>
            
            <Button type="button" variant="secondary" onClick={handleGenerateAI} disabled={loadingAi || !selectedLead} className="w-full">
              {loadingAi ? 'Generating...' : '✨ Auto-Generate with AI'}
            </Button>

            <div>
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Input required value={subject} onChange={e => setSubject(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Message Body</label>
              <textarea 
                required 
                value={body} 
                onChange={e => setBody(e.target.value)} 
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[200px]"
              />
            </div>

            <Button type="submit" disabled={sending} className="w-full">{sending ? 'Sending...' : 'Send Email'}</Button>
          </form>
        </div>

        {/* Logs Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Outreach Logs</h3>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-gray-500">
                  <th className="p-3 font-medium">To</th>
                  <th className="p-3 font-medium">Subject</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-gray-500">No emails sent yet.</td></tr>
                ) : logs.map(log => (
                  <tr key={log._id}>
                    <td className="p-3 font-medium text-gray-900">{log.toEmail}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[150px]">{log.subject}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${log.sendStatus === 'sent' ? 'bg-green-100 text-green-700' : log.sendStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                        {log.sendStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
