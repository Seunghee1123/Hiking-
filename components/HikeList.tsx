
import React, { useState } from 'react';
import { HikeRecord, HikeStatus } from '../types';
import { Trash2, CheckCircle2, Circle, Star, ArrowUpRight } from 'lucide-react';

interface HikeListProps {
  records: HikeRecord[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const HikeList: React.FC<HikeListProps> = ({ records, onDelete, onToggle }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'wish'>('all');

  const filteredRecords = records.filter(r => {
    if (filter === 'completed') return r.status === HikeStatus.COMPLETED;
    if (filter === 'wish') return r.status === HikeStatus.WISH;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">나의 기록실</h2>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <FilterButton active={filter === 'all'} label="전체" onClick={() => setFilter('all')} />
          <FilterButton active={filter === 'completed'} label="정복" onClick={() => setFilter('completed')} />
          <FilterButton active={filter === 'wish'} label="위시" onClick={() => setFilter('wish')} />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block p-4 bg-slate-100 rounded-full">
            <Star className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">아직 등록된 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => (
            <div 
              key={record.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={record.image || `https://picsum.photos/seed/${record.mountainName}/600/400`} 
                  alt={record.mountainName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${record.status === HikeStatus.COMPLETED ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                    {record.status === HikeStatus.COMPLETED ? '정복' : '위시'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{record.mountainName}</h3>
                    <p className="text-xs font-bold text-slate-400">{record.elevation}m • {record.date}</p>
                  </div>
                  <button 
                    onClick={() => onToggle(record.id)}
                    className={`p-2 rounded-xl transition-colors ${record.status === HikeStatus.COMPLETED ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed h-10">
                  {record.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    onClick={() => onDelete(record.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    상세보기 <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterButton: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
      active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    {label}
  </button>
);

export default HikeList;
