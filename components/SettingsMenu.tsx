
import React from 'react';
import { X, Type, Eye, Palette, Languages, Frame } from 'lucide-react';
import { AppSettings, Theme, BorderStyle } from '../types';
import { FONT_OPTIONS } from '../constants';

interface SettingsMenuProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, setSettings, onClose }) => {
  const borderOptions = [
    { name: 'Ornate (Klasik)', value: BorderStyle.Ornate },
    { name: 'Solid (Polos)', value: BorderStyle.Solid },
    { name: 'Dashed (Putus)', value: BorderStyle.Dashed },
    { name: 'Dotted (Titik)', value: BorderStyle.Dotted },
    { name: 'Minimal', value: BorderStyle.Minimal },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`relative w-full max-w-sm h-full shadow-2xl transition-transform flex flex-col ${
        settings.theme === Theme.Dark ? 'bg-neutral-900 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          settings.theme === Theme.Dark ? 'border-neutral-800' : 'border-slate-100'
        }`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Palette className="text-emerald-500" /> Pengaturan Tampilan
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${settings.theme === Theme.Dark ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
          {/* Theme Section */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2">
               Pilih Tema
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSettings(s => ({ ...s, theme: Theme.Light }))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  settings.theme === Theme.Light 
                  ? 'border-emerald-500 bg-emerald-50/50' 
                  : 'border-transparent bg-slate-100/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="font-bold text-slate-700">Terang</span>
              </button>
              <button 
                onClick={() => setSettings(s => ({ ...s, theme: Theme.Dark }))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  settings.theme === Theme.Dark 
                  ? 'border-emerald-500 bg-neutral-800' 
                  : 'border-transparent bg-neutral-100/10'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="font-bold">Gelap</span>
              </button>
            </div>
          </section>

          {/* Border Style Section */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2">
              <Frame size={16} /> Gaya Bingkai Mushaf
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {borderOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSettings(s => ({ ...s, borderStyle: opt.value }))}
                  className={`px-4 py-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                    settings.borderStyle === opt.value
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                    : settings.theme === Theme.Dark ? 'border-neutral-800 bg-neutral-800/50 text-neutral-300' : 'border-slate-100 bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="font-medium">{opt.name}</span>
                  {settings.borderStyle === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Font Family Section */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2">
              <Languages size={16} /> Jenis Font (Khatt)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setSettings(s => ({ ...s, fontFamily: font.value }))}
                  className={`px-4 py-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                    settings.fontFamily === font.value
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                    : settings.theme === Theme.Dark ? 'border-neutral-800 bg-neutral-800/50 text-neutral-300' : 'border-slate-100 bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="font-medium">{font.name}</span>
                  {settings.fontFamily === font.value && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Font Size Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                 <Type size={16} /> Ukuran Font
               </h3>
               <span className="text-emerald-500 font-bold">{settings.fontSize}px</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="60" 
              value={settings.fontSize}
              onChange={(e) => setSettings(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between mt-2 text-xs opacity-40">
              <span>Kecil</span>
              <span>Besar</span>
            </div>
          </section>

          {/* Opacity Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                 <Eye size={16} /> Transparansi Teks
               </h3>
               <span className="text-emerald-500 font-bold">{settings.opacity}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={settings.opacity}
              onChange={(e) => setSettings(s => ({ ...s, opacity: parseInt(e.target.value) }))}
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </section>
        </div>

        <div className={`p-6 border-t ${settings.theme === Theme.Dark ? 'border-neutral-800' : 'border-slate-100'}`}>
           <button 
            onClick={onClose}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
           >
             Simpan Pengaturan
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
