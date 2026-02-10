
import React, { useState } from 'react';
import { X, Search, Mountain, MapPin } from 'lucide-react';
import { HikeRecord, HikeStatus } from '../types';

interface HikeFormProps {
  onClose: () => void;
  onSubmit: (record: HikeRecord) => void;
}

const HikeForm: React.FC<HikeFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    mountainName: '',
    elevation: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: HikeStatus.COMPLETED,
    lat: '37.5',
    lng: '127.0'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HikeRecord = {
      id: Date.now().toString(),
      mountainName: formData.mountainName,
      elevation: parseInt(formData.elevation) || 0,
      date: formData.date,
      description: formData.description,
      status: formData.status,
      coords: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      image: `https://picsum.photos/seed/${formData.mountainName}/600/400`
    };
    onSubmit(newRecord);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">새로운 등산 기록</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">산 이름</label>
            <div className="relative">
              <Mountain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="text"
                placeholder="예: 지리산, 한라산..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                value={formData.mountainName}
                onChange={e => setFormData(prev => ({ ...prev, mountainName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">고도 (m)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.elevation}
                onChange={e => setFormData(prev => ({ ...prev, elevation: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">날짜</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">위도</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.lat}
                onChange={e => setFormData(prev => ({ ...prev, lat: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">경도</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={formData.lng}
                onChange={e => setFormData(prev => ({ ...prev, lng: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">기록 구분</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: HikeStatus.COMPLETED }))}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                  formData.status === HikeStatus.COMPLETED 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                  : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                다녀온 산
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: HikeStatus.WISH }))}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                  formData.status === HikeStatus.WISH 
                  ? 'bg-orange-400 border-orange-400 text-white shadow-lg shadow-orange-100' 
                  : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                위시리스트
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">메모 / 소감</label>
            <textarea
              rows={3}
              placeholder="산행은 어떠셨나요?"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
          >
            기록 저장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default HikeForm;
