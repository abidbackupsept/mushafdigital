
import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen } from 'lucide-react';
import { SURAHS } from '../constants';
import { Theme, Surah } from '../types';

interface JumpToSurahModalProps {
  theme: Theme;
  onSelect: (surah: Surah) => void;
  onClose: () => void;
}

const JumpToSurahModal: React.FC<JumpToSurahModalProps> = ({ theme, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    return SURAHS.filter(s => 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery
    );
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-lg max-h-[80vh] shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${
        theme === Theme.Dark ? 'bg-neutral-900 text-white border border-neutral-800' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          theme === Theme.Dark ? 'border-neutral-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold">Lompat ke Surah</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === Theme.Dark ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className={`relative flex items-center rounded-2xl border-2 transition-all focus-within:border-emerald-500/50 ${
            theme === Theme.Dark ? 'bg-neutral-800 border-neutral-700' : 'bg-slate-50 border-slate-100'
          }`}>
            <Search className="absolute left-4 text-emerald-500" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama surah atau nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent py-4 pl-12 pr-4 outline-none font-medium placeholder:opacity-50"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            {filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => onSelect(surah)}
                  className={`group flex items-center p-4 rounded-2xl border transition-all text-left ${
                    theme === Theme.Dark 
                    ? 'border-neutral-800 bg-neutral-800/50 hover:border-emerald-500/50 hover:bg-neutral-800' 
                    : 'border-slate-100 bg-slate-50/50 hover:border-emerald-500/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-colors ${
                    theme === Theme.Dark ? 'bg-neutral-700 text-neutral-400 group-hover:text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {surah.number}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold group-hover:text-emerald-500 transition-colors">{surah.englishName}</h4>
                    <p className="text-xs opacity-50 uppercase tracking-wider">{surah.numberOfAyahs} Ayat • Hal {surah.startPage}</p>
                  </div>
                  <div className={`text-xl font-surah-name opacity-10 group-hover:opacity-40 transition-opacity ${
                    theme === Theme.Dark ? 'text-white' : 'text-emerald-900'
                  }`}>
                    surah{String(surah.number).padStart(3, '0')}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center opacity-40">
                <p className="font-medium">Surah tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpToSurahModal;
