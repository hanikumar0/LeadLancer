import Link from 'next/link';
import { Home, Users, TrendingUp, Settings, Mail, LogOut, KanbanSquare, MessageSquare, BarChart, Cpu, Server } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col hidden md:flex">
      <div className="p-6 text-2xl font-bold tracking-tight">LeadLancer</div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Home className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/dashboard/inbox" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <MessageSquare className="w-5 h-5" /> Inbox
        </Link>
        <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <BarChart className="w-5 h-5" /> Analytics
        </Link>
        <Link href="/dashboard/automations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Cpu className="w-5 h-5" /> Automations
        </Link>
        <Link href="/dashboard/health" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Server className="w-5 h-5" /> System Health
        </Link>
        <Link href="/dashboard/finder" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Users className="w-5 h-5" /> Lead Finder
        </Link>
        <Link href="/dashboard/leads" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <TrendingUp className="w-5 h-5" /> My Leads
        </Link>
        <Link href="/dashboard/outreach" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Mail className="w-5 h-5" /> Outreach
        </Link>
        <Link href="/dashboard/crm" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <KanbanSquare className="w-5 h-5" /> CRM Pipeline
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          <Settings className="w-5 h-5" /> Settings
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button className="w-full text-left px-3 py-2 text-gray-400 hover:text-white" onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}
