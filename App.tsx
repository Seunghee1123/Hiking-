
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Map as MapIcon, ClipboardList, TrendingUp, Compass, Search, Calendar, Info, Star } from 'lucide-react';
import { HikeRecord, HikeStatus } from './types';
import HikeForm from './components/HikeForm';
import HikeList from './components/HikeList';
import Statistics from './components/Statistics';
import MountainMap from './components/MountainMap';
import { getMountainInsights } from './services/geminiService';

const App: React.FC = () => {
  const [records, setRecords] = useState<HikeRecord[]>(() => {
    const saved = localStorage.getItem('hiking_records');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        mountainName: '북한산 (Bukhansan)',
        elevation: 836,
        date: '2024-03-15',
        description: '백운대 코스로 올라갔는데 정상이 정말 멋졌어요.',
        status: HikeStatus.COMPLETED,
        coords: { lat: 37.6611, lng: 126.9922 },
        rating: 5,
        image: 'https://picsum.photos/seed/bukhansan/600/400'
      },
      {
        id: '2',
        mountainName: '설악산 (Seoraksan)',
        elevation: 1708,
        date: '2024-05-10',
        description: '공룡능선 도전 예정!',
        status: HikeStatus.WISH,
        coords: { lat: 38.1189, lng: 128.4358 }
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'stats'>('map');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HikeRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('hiking_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: HikeRecord) => {
    setRecords(prev => [record, ...prev]);
    setIsFormOpen(false);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const toggleStatus = (id: string) => {
    setRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === HikeStatus.COMPLETED ? HikeStatus.WISH : HikeStatus.COMPLETED } : r
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Compass className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-900">산들바람</h1>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">기록하기</span>
        </button>
      </header>

      {/* Main Navigation */}
      <nav className="bg-white px-4 py-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <TabButton 
          active={activeTab === 'map'} 
          onClick={() => setActiveTab('map')} 
          icon={<MapIcon className="w-4 h-4" />} 
          label="등산 지도" 
        />
        <TabButton 
          active={activeTab === 'list'} 
          onClick={() => setActiveTab('list')} 
          icon={<ClipboardList className="w-4 h-4" />} 
          label="나의 기록" 
        />
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="통계" 
        />
      </nav>

      {/* Content Area */}
      <main className="flex-1 relative overflow-auto">
        <div className="max-w-6xl mx-auto h-full p-4 md:p-6">
          {activeTab === 'map' && (
            <div className="h-full flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">전국 등산 맵</h2>
                  <p className="text-sm text-slate-500">지금까지 정복한 산과 가고 싶은 산을 한눈에 확인하세요.</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>다녀온 산 ({records.filter(r => r.status === HikeStatus.COMPLETED).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span>위시리스트 ({records.filter(r => r.status === HikeStatus.WISH).length})</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <MountainMap records={records} onMarkerClick={setSelectedRecord} />
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <HikeList 
              records={records} 
              onDelete={deleteRecord} 
              onToggle={toggleStatus} 
            />
          )}

          {activeTab === 'stats' && (
            <Statistics records={records} />
          )}
        </div>
      </main>

      {/* Modals */}
      {isFormOpen && (
        <HikeForm onClose={() => setIsFormOpen(false)} onSubmit={addRecord} />
      )}

      {selectedRecord && (
        <RecordDetailModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
          onDelete={(id) => { deleteRecord(id); setSelectedRecord(null); }}
        />
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

const RecordDetailModal: React.FC<{ record: HikeRecord; onClose: () => void; onDelete: (id: string) => void }> = ({ record, onClose, onDelete }) => {
  const [aiInfo, setAiInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAiInfo = async () => {
    setLoading(true);
    const info = await getMountainInsights(record.mountainName);
    setAiInfo(info);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative h-56 bg-emerald-800">
          <img 
            src={record.image || `https://picsum.photos/seed/${record.mountainName}/800/600`} 
            alt={record.mountainName} 
            className="w-full h-full object-cover opacity-80"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 rotate-45" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <span className={`text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block ${record.status === HikeStatus.COMPLETED ? 'bg-emerald-500' : 'bg-orange-500'}`}>
              {record.status === HikeStatus.COMPLETED ? '정복 완료' : '위시리스트'}
            </span>
            <h2 className="text-3xl font-black drop-shadow-md">{record.mountainName}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 해발 고도
              </p>
              <p className="text-lg font-bold">{record.elevation}m</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 날짜
              </p>
              <p className="text-lg font-bold">{record.date}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" /> 나의 한줄평
            </h3>
            <p className="text-slate-600 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 italic">
              "{record.description}"
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" /> 산들바람 AI 팁
              </h3>
              {!aiInfo && !loading && (
                <button 
                  onClick={fetchAiInfo}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  AI 정보 불러오기
                </button>
              )}
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center animate-pulse">
                <Search className="w-4 h-4 animate-spin" /> Gemini AI가 정보를 분석 중입니다...
              </div>
            )}

            {aiInfo && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2">
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                  {aiInfo.description}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">난이도: {aiInfo.difficulty}</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">추천 계절: {aiInfo.recommendedSeason}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2">추천 장비</p>
                  <div className="flex flex-wrap gap-2">
                    {aiInfo.gearSuggestions.map((gear: string, i: number) => (
                      <span key={i} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-700 shadow-sm">
                        {gear}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => onDelete(record.id)}
            className="w-full py-3 text-red-500 font-semibold text-sm hover:bg-red-50 rounded-2xl transition-colors border border-transparent hover:border-red-100"
          >
            기록 삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
