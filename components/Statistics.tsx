
import React, { useMemo } from 'react';
import { HikeRecord, HikeStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, Mountain, ArrowUpRight, Award } from 'lucide-react';

interface StatisticsProps {
  records: HikeRecord[];
}

const Statistics: React.FC<StatisticsProps> = ({ records }) => {
  const completedHikes = records.filter(r => r.status === HikeStatus.COMPLETED);
  
  const stats = useMemo(() => {
    const totalElevation = completedHikes.reduce((acc, curr) => acc + curr.elevation, 0);
    const avgElevation = completedHikes.length > 0 ? Math.round(totalElevation / completedHikes.length) : 0;
    const maxPeak = completedHikes.length > 0 ? Math.max(...completedHikes.map(h => h.elevation)) : 0;
    
    // Group by month for chart
    const monthlyData: Record<string, number> = {};
    completedHikes.forEach(h => {
      const month = h.date.split('-').slice(0, 2).join('-');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const chartData = Object.entries(monthlyData)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { totalElevation, avgElevation, maxPeak, chartData };
  }, [completedHikes]);

  const pieData = [
    { name: '다녀옴', value: completedHikes.length, color: '#10b981' },
    { name: '위시리스트', value: records.length - completedHikes.length, color: '#fb923c' }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Trophy className="text-yellow-500" />} 
          label="총 정복 수" 
          value={`${completedHikes.length}개`} 
          subValue="지금까지 오른 산"
        />
        <StatCard 
          icon={<Mountain className="text-emerald-500" />} 
          label="누적 고도" 
          value={`${stats.totalElevation.toLocaleString()}m`} 
          subValue="지구의 지름만큼!"
        />
        <StatCard 
          icon={<ArrowUpRight className="text-blue-500" />} 
          label="최고 고도" 
          value={`${stats.maxPeak.toLocaleString()}m`} 
          subValue="최고의 정점"
        />
        <StatCard 
          icon={<Award className="text-purple-500" />} 
          label="평균 고도" 
          value={`${stats.avgElevation.toLocaleString()}m`} 
          subValue="꾸준한 도전"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black mb-6 text-slate-800">월별 등산 횟수</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-black mb-6 self-start text-slate-800">목표 달성률</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-2 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
    <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className="text-2xl font-black text-slate-900">{value}</span>
    <span className="text-[10px] text-slate-500 font-medium">{subValue}</span>
  </div>
);

export default Statistics;
