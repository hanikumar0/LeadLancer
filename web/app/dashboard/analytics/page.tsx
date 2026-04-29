"use client";

import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/analyticsService';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Target, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getOverview();
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const exportCsv = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Leads,${data.kpis.totalLeads}\n`
      + `Hot Leads,${data.kpis.hotLeads}\n`
      + `Pipeline Value,${data.kpis.pipelineValue}\n`
      + `Won Revenue,${data.kpis.wonRevenue}\n`
      + `Productivity Score,${data.productivityScore}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leadlancer_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Growth Dashboard</h2>
          <p className="text-gray-500">Track your agency performance and pipeline</p>
        </div>
        <Button onClick={exportCsv} variant="outline"><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
      </div>

      {/* Insights Row */}
      {data.insights && data.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">AI Growth Insights</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 mt-1 space-y-1">
              {data.insights.map((insight: any, i: number) => (
                <li key={i}>{insight.text}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2"><Users className="w-4 h-4"/> Total Leads</div>
          <div className="text-3xl font-bold">{data.kpis.totalLeads}</div>
          <div className="text-xs text-green-600 mt-1">+{data.kpis.newLeadsMonth} this month</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2"><Target className="w-4 h-4"/> Reply Rate</div>
          <div className="text-3xl font-bold">{data.kpis.replyRate}%</div>
          <div className="text-xs text-gray-500 mt-1">{data.kpis.outbox} sent</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4"/> Won Revenue</div>
          <div className="text-3xl font-bold text-green-600">${data.kpis.wonRevenue}</div>
          <div className="text-xs text-gray-500 mt-1">${data.kpis.pipelineValue} in pipeline</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2"><Activity className="w-4 h-4"/> Productivity</div>
          <div className="text-3xl font-bold text-blue-600">{data.productivityScore}/100</div>
          <div className="text-xs text-gray-500 mt-1">Based on CRM activity</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-6">CRM Funnel Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends.funnel} layout="vertical" margin={{ left: 50 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-6">Top Niches by Revenue</h3>
          <div className="h-[300px] flex items-center justify-center">
            {data.trends.niches.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.trends.niches} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {data.trends.niches.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No won revenue yet to analyze.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
