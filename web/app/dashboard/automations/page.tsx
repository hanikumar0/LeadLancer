"use client";

import { useState, useEffect } from 'react';
import { automationService } from '@/lib/automationService';
import { Button } from '@/components/ui/button';
import { Bot, CheckCircle, Zap, Clock, BrainCircuit } from 'lucide-react';

export default function AutomationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await automationService.getDashboard();
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const dismissRec = async (id: string) => {
    await automationService.dismissRecommendation(id);
    fetchData();
  };

  if (loading) return <div className="p-8 text-center">Loading Automation Engine...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-indigo-600"/> Hands-Free Growth Engine</h2>
          <p className="text-gray-500 mt-1">Manage rules, scheduled outreach, and AI coaching.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Recommendations Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> AI Coach</h3>
          {data.recommendations.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500">You are all caught up!</div>
          ) : data.recommendations.map((rec: any) => (
            <div key={rec._id} className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl flex gap-4">
              <div className="bg-indigo-100 p-2 rounded-full h-fit"><Zap className="w-5 h-5 text-indigo-600"/></div>
              <div className="flex-1">
                <h4 className="font-bold text-indigo-900">{rec.title}</h4>
                <p className="text-indigo-800 text-sm mt-1">{rec.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Take Action</Button>
                  <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-100" onClick={() => dismissRec(rec._id)}>Dismiss</Button>
                </div>
              </div>
            </div>
          ))}

          {/* Active Rules */}
          <h3 className="font-semibold text-lg flex items-center gap-2 mt-8"><CheckCircle className="w-5 h-5"/> Active Rules</h3>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            {data.rules.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No active rules yet. Create your first automation!</p>
            ) : data.rules.map((rule: any) => (
              <div key={rule._id} className="flex justify-between items-center p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-semibold">{rule.name}</div>
                  <div className="text-xs text-gray-500">Triggers: {rule.trigger}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${rule.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {rule.isEnabled ? 'Active' : 'Paused'}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-dashed">+ Build New Rule</Button>
          </div>
        </div>

        {/* Scheduled Tasks Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Clock className="w-5 h-5"/> Scheduled Queue</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {data.tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-400">Queue is empty</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.tasks.map((task: any) => (
                  <div key={task._id} className="p-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm uppercase">{task.type}</span>
                      <span className="text-xs text-blue-600 font-medium">{task.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">Scheduled: {new Date(task.runAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
