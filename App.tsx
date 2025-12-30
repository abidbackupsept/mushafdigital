import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Settings as SettingsIcon, Moon, Sun, ChevronLeft, ChevronRight, FileText, List, Bookmark as BookmarkIcon, Maximize, Minimize } from 'lucide-react';
import SurahList from './components/SurahList';
import MushafView from './components/MushafView';
import SettingsMenu from './components/SettingsMenu';
import JumpToSurahModal from './components/JumpToSurahModal';
import AuthGuard from './components/AuthGuard';
import { Theme, AppSettings, Surah, BorderStyle } from './types';
import './print-styles.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number | null>(null); // null means home
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmark, setBookmark] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    theme: Theme.Light,
    fontSize: 32,
    opacity: 100,
    fontFamily: 'Uthmanic',
    borderStyle: BorderStyle.Ornate
  });

  // Load bookmark on mount
  useEffect(() => {
    const savedBookmark = localStorage.getItem('mushaf_bookmark');
    if (savedBookmark) {
      setBookmark(parseInt(savedBookmark));
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === Theme.Light ? Theme.Dark : Theme.Light
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (settings.theme === Theme.Dark) {
      document.body.classList.add('bg-neutral-900', 'text-white');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('bg-neutral-900', 'text-white');
    }
  }, [settings.theme]);

  const navigateToPage = (pageNum: number) => {
    setCurrentPage(pageNum);
    setShowJumpModal(false);
  };

  const handleSelectSurah = (surah: Surah) => {
    navigateToPage(surah.startPage);
  };

  const handleToggleBookmark = (page: number) => {
    if (bookmark === page) {
      setBookmark(null);
      localStorage.removeItem('mushaf_bookmark');
    } else {
      setBookmark(page);
      localStorage.setItem('mushaf_bookmark', page.toString());
    }
  };

  const downloadAsPdf = () => {
    const node = document.getElementById('mushaf-page');
    if (!node) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // 1. Ekstrak dan suntikkan aturan @font-face
    const fontStylesText = Array.from(document.styleSheets)
      .flatMap(sheet => {
        try { return Array.from(sheet.cssRules); } catch (e) { return []; }
      })
      .filter(rule => rule.type === CSSRule.FONT_FACE_RULE)
      .map(rule => rule.cssText)
      .join('\n');
    
    const fontStyleElement = document.createElement('style');
    fontStyleElement.appendChild(document.createTextNode(fontStylesText));
    iframeDoc.head.appendChild(fontStyleElement);

    // 2. Salin semua stylesheet lainnya (baik link maupun inline)
    Array.from(document.styleSheets).forEach(styleSheet => {
      if (styleSheet.href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSheet.href;
        iframeDoc.head.appendChild(link);
      } else {
         try {
            const inlineStyle = document.createElement('style');
            inlineStyle.appendChild(document.createTextNode(Array.from(styleSheet.cssRules).map(r => r.cssText).join('\n')));
            iframeDoc.head.appendChild(inlineStyle);
         } catch (e) {
            // Abaikan
         }
      }
    });
    
    // 3. Klone node konten
    const clonedNode = node.cloneNode(true) as HTMLElement;
    
    // 4. Siapkan body iframe dan suntikkan gaya pemusatan
    iframeDoc.body.innerHTML = ''; 
    iframeDoc.body.style.textAlign = 'center'; 
    iframeDoc.body.appendChild(clonedNode);

    // Atur ulang beberapa gaya inline yang mungkin mengganggu
    clonedNode.style.margin = 'auto';
    clonedNode.style.transform = 'none';

    // Beri jeda singkat agar font sempat dimuat di iframe
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Hapus iframe setelah proses cetak (atau pembatalan)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  return (
    <AuthGuard>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${settings.theme === Theme.Dark ? 'bg-neutral-900' : 'bg-slate-50'}`}>
        {/* Header */}
        {!isFullscreen && (
          <header className={`sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md flex justify-between items-center ${
            settings.theme === Theme.Dark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-600/20">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="font-bold text-lg">Al-Qur'anul Karim</h1>
                <p className="text-xs opacity-60 uppercase tracking-widest font-medium">Digital Mushaf Edition</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                title="Ganti Tema"
                className={`p-2 rounded-full transition-colors ${
                  settings.theme === Theme.Dark ? 'hover:bg-neutral-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                {settings.theme === Theme.Dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {currentPage !== null && (
                <button 
                  onClick={() => setShowSettings(true)}
                  title="Pengaturan"
                  className={`p-2 rounded-full transition-colors ${
                    settings.theme === Theme.Dark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <SettingsIcon size={20} />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-hidden relative ${isFullscreen ? 'pt-0' : ''}`}>
          {currentPage === null ? (
            <div className="h-full flex flex-col">
              {bookmark && (
                <div className="px-6 pt-6 max-w-7xl mx-auto w-full">
                  <button 
                    onClick={() => navigateToPage(bookmark)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group ${
                      settings.theme === Theme.Dark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 p-3 rounded-xl text-white shadow-md">
                        <BookmarkIcon size={20} fill="currentColor" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold opacity-70 uppercase tracking-tight">Lanjutkan Membaca</p>
                        <p className="font-bold text-lg">Halaman {bookmark}</p>
                      </div>
                    </div>
                    <ChevronRight size={24} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
              <SurahList onSelectSurah={handleSelectSurah} theme={settings.theme} />
            </div>
          ) : (
            <MushafView 
              page={currentPage} 
              settings={settings}
              onPageChange={setCurrentPage}
              onGoHome={() => setCurrentPage(null)}
              bookmark={bookmark}
              onToggleBookmark={() => handleToggleBookmark(currentPage)}
            />
          )}
        </main>

        {/* Navigation Footer (Floating for Mushaf) */}
        {currentPage !== null && (
          <footer className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 transition-all border ${
            settings.theme === Theme.Dark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          } ${isFullscreen ? 'opacity-40 hover:opacity-100' : ''}`}>
            <button 
              onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
              className="hover:text-emerald-500 transition-colors disabled:opacity-30"
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs opacity-50 font-semibold uppercase">Halaman</span>
              <span className="font-bold text-lg">{currentPage}</span>
            </div>

            <button 
               onClick={() => navigateToPage(Math.min(604, currentPage + 1))}
               className="hover:text-emerald-500 transition-colors disabled:opacity-30"
               disabled={currentPage >= 604}
            >
              <ChevronRight size={24} />
            </button>

            <div className="w-[1px] h-6 bg-slate-300/30"></div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleFullscreen}
                title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh Imersif"}
                className={`transition-colors p-1 rounded-lg ${
                  isFullscreen 
                  ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20' 
                  : 'hover:text-emerald-500 hover:bg-emerald-500/10'
                }`}
              >
                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>

              <button 
                onClick={downloadAsPdf}
                title="Cetak / Simpan PDF"
                className="hover:text-emerald-500 transition-colors"
              >
                <FileText size={22} />
              </button>

              <button 
                onClick={() => setShowJumpModal(true)}
                title="Lompat ke Surah"
                className="hover:text-emerald-500 transition-colors"
              >
                <List size={22} />
              </button>

              <button 
                onClick={() => setCurrentPage(null)}
                title="Ke Beranda"
                className="hover:text-emerald-500 transition-colors"
              >
                <Home size={22} />
              </button>
            </div>
          </footer>
        )}

        {/* Overlays */}
        {showSettings && (
          <SettingsMenu 
            settings={settings} 
            setSettings={setSettings} 
            onClose={() => setShowSettings(false)} 
          />
        )}

        {showJumpModal && (
          <JumpToSurahModal 
            theme={settings.theme}
            onSelect={handleSelectSurah}
            onClose={() => setShowJumpModal(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default App;
