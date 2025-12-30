
import React from 'react';
import { Surah, Theme } from '../types';
import { SURAHS } from '../constants';

interface SurahListProps {
  onSelectSurah: (surah: Surah) => void;
  theme: Theme;
}

const SurahList: React.FC<SurahListProps> = ({ onSelectSurah, theme }) => {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto overflow-y-auto h-full no-scrollbar pb-24">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-extrabold mb-3 ${theme === Theme.Dark ? 'text-white' : 'text-slate-900'}`}>
          Daftar Surah
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === Theme.Dark ? 'text-neutral-400' : 'text-slate-500'}`}>
          Pilih surah untuk mulai membaca dari halaman pertamanya
        </p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
        <h3 className={`font-bold text-xl ${theme === Theme.Dark ? 'text-white' : 'text-slate-800'}`}>Semua Surah</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SURAHS.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onSelectSurah(surah)}
            className={`group relative flex items-center p-6 rounded-3xl transition-all duration-300 text-left border overflow-hidden ${
              theme === Theme.Dark 
                ? 'bg-neutral-800/40 border-neutral-700 hover:bg-neutral-800 hover:border-emerald-500/50' 
                : 'bg-white border-slate-100 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
            }`}
          >
            <div className={`relative z-10 w-14 h-14 flex items-center justify-center rounded-2xl font-bold text-xl rotate-45 group-hover:rotate-0 transition-transform duration-500 ${
              theme === Theme.Dark ? 'bg-neutral-700 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
               <span className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                {surah.number}
               </span>
            </div>

            <div className="ml-6 flex-1">
              <h4 className={`text-xl font-bold group-hover:text-emerald-500 transition-colors ${
                theme === Theme.Dark ? 'text-white' : 'text-slate-800'
              }`}>
                {surah.englishName}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  theme === Theme.Dark ? 'bg-neutral-700 text-neutral-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {surah.revelationType}
                </span>
                <span className={`text-[10px] font-medium opacity-60 uppercase ${
                  theme === Theme.Dark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  {surah.numberOfAyahs} Ayat
                </span>
              </div>
            </div>

            <div className={`text-2xl font-surah-name opacity-20 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 ${
               theme === Theme.Dark ? 'text-white' : 'text-emerald-900'
            }`}>
              surah{String(surah.number).padStart(3, '0')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
