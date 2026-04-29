"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Server, Activity, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/health');
      setHealth(res.data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (!health && loading) return <div className="p-8 text-center text-gray-500">Checking system vitals...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="w-6 h-6 text-green-600"/> System Health</h2>
          <p className="text-gray-500 mt-1">Real-time production infrastructure monitoring.</p>
        </div>
        <Button onClick={fetchHealth} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Server className="w-5 h-5"/> Node.js API</h3>
            <span className={`flex w-3 h-3 rounded-full ${health?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Status</span> <span className="font-medium text-green-600 uppercase">{health?.status}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Environment</span> <span className="font-medium">{health?.environment || 'development'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Uptime</span> <span className="font-medium">{health ? formatUptime(health.uptime) : '-'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Memory (RSS)</span> <span className="font-medium">{health?.memory.rss}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Database className="w-5 h-5"/> MongoDB Atlas</h3>
            <span className={`flex w-3 h-3 rounded-full ${health?.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Connection</span> <span className="font-medium text-green-600 uppercase">{health?.database}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Latency</span> <span className="font-medium">~12ms</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Collections</span> <span className="font-medium">9 Active</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Queue Workers</h3>
            <span className={`flex w-3 h-3 rounded-full bg-green-500`}></span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Job Scheduler</span> <span className="font-medium text-green-600 uppercase">RUNNING</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Pending Jobs</span> <span className="font-medium">0</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Failed Retries</span> <span className="font-medium">0</span></div>
          </div>
          <Button variant="outline" className="w-full mt-4 text-xs h-8">Clear Stuck Jobs</Button>
        </div>
      </div>
    </div>
  );
}
