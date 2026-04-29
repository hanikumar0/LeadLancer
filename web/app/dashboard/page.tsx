"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        setUser(data.data);
      } catch (error) {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{ title: 'Total Leads', value: '1,240' },
          { title: 'Emails Sent', value: '840' },
          { title: 'Replies', value: '124' },
          { title: 'Conversion Rate', value: '14.7%' }].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-sm">No recent activity to show.</div>
      </div>
    </div>
  );
}
