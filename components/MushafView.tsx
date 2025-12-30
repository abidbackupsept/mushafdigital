
import React, { useState, useEffect, useRef } from 'react';
import { Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ayah, PageData, AppSettings, Theme, BorderStyle } from '../types';

interface MushafViewProps {
  page: number;
  settings: AppSettings;
  onPageChange: (page: number) => void;
  onGoHome: () => void;
  bookmark: number | null;
  onToggleBookmark: () => void;
}

const MushafView: React.FC<MushafViewProps> = ({ page, settings, onPageChange, onGoHome, bookmark, onToggleBookmark }) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const prevPageRef = useRef(page);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Swipe gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const isBookmarked = bookmark === page;

  // Helper to convert Western numerals to Arabic numerals
  const toArabicNumerals = (num: number): string => {
    return num.toString().split('').map(digit => {
      return String.fromCharCode(digit.charCodeAt(0) + 1584);
    }).join('');
  };

  // Detect direction and reset scroll
  useEffect(() => {
    if (page > prevPageRef.current) {
      setDirection(1);
    } else if (page < prevPageRef.current) {
      setDirection(-1);
    }
    prevPageRef.current = page;

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [page]);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`);
        const data = await response.json();
        if (data.code === 200) {
          setPageData(data.data);
        } else {
          setError('Failed to fetch Quran page.');
        }
      } catch (err) {
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  // Handle Swipe Gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchStartX.current - touchEndX;
    const dy = touchStartY.current - touchEndY;

    // Check if horizontal swipe is dominant and exceeds threshold
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
      if (dx > 0) {
        // Swiped Left -> Next Page
        if (page < 604) onPageChange(page + 1);
      } else {
        // Swiped Right -> Previous Page
        if (page > 1) onPageChange(page - 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const renderContent = () => {
    if (!pageData) return null;

    const elements: React.ReactNode[] = [];
    const isDark = settings.theme === Theme.Dark;

    pageData.ayahs.forEach((ayah) => {
      if (ayah.numberInSurah === 1 && ayah.surah) {
        elements.push(
          <div key={`header-${ayah.surah.number}`} className="mb-8 mt-12 first:mt-4 text-center select-none z-10">
            <div className="inline-block w-full max-w-[500px]">
              <div className={`font-surah-header relative text-[75px] leading-none flex items-center justify-center transition-all ${isDark ? 'text-emerald-500/40' : 'text-emerald-800/40'}`}>
                header
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className={`font-surah-name text-[60px] mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    surah{String(ayah.surah.number).padStart(3, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

        if (ayah.surah.number !== 1 && ayah.surah.number !== 9) {
           elements.push(
            <div key={`basmalah-${ayah.surah.number}`} className="text-center text-3xl md:text-4xl mb-6 mt-4 opacity-90 relative z-10" style={{ fontFamily: settings.fontFamily }}>
              ﷽
            </div>
           );
        }
      }

      let cleanText = ayah.text;
      const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
      if (ayah.numberInSurah === 1 && ayah.surah?.number !== 1 && ayah.text.startsWith(bismillah)) {
        cleanText = ayah.text.replace(bismillah, "").trim();
      }

      if (cleanText) {
          const hideAyahBorder = ['Uthmanic', 'Nastaleeq', 'QuranV2', 'Indopak'].includes(settings.fontFamily);

          elements.push(
            <span 
                key={`ayah-${ayah.number}`} 
                className="inline transition-opacity duration-300 relative z-10"
                style={{ opacity: settings.opacity / 100 }}
            >
                {cleanText}
                <span 
                    className={`inline-flex items-center justify-center min-w-[32px] px-1 mx-2 font-bold text-emerald-600 select-none ${
                        hideAyahBorder 
                        ? 'text-xl translate-y-[-2px]' 
                        : 'text-sm border-2 border-emerald-500/40 rounded-full h-8 translate-y-[-4px]'
                    }`} 
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {toArabicNumerals(ayah.numberInSurah)}
                </span>
            </span>
          );
      }
    });

    return elements;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-4">
          <p className="font-bold">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const isDark = settings.theme === Theme.Dark;

  // Variants for page transitions
  const pageVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : dir < 0 ? -50 : 0,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : dir < 0 ? 50 : 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
      }
    }),
  };

  // Border Style CSS Mapping
  const getBorderClasses = () => {
    const isOrnate = settings.borderStyle === BorderStyle.Ornate;
    const isMinimal = settings.borderStyle === BorderStyle.Minimal;
    
    let base = `max-w-[850px] mx-auto p-12 md:p-20 rounded-[0.5rem] shadow-2xl min-h-[95vh] relative flex flex-col transition-all duration-300 `;
    
    if (isDark) {
      base += 'bg-neutral-900 text-neutral-100 shadow-black/60 ';
      if (isOrnate) base += 'border-[12px] border-emerald-900 ';
      else if (isMinimal) base += 'border-0 ';
      else if (settings.borderStyle === BorderStyle.Solid) base += 'border-4 border-emerald-900 ';
      else if (settings.borderStyle === BorderStyle.Dashed) base += 'border-4 border-dashed border-emerald-900 ';
      else if (settings.borderStyle === BorderStyle.Dotted) base += 'border-4 border-dotted border-emerald-900 ';
    } else {
      base += 'bg-[#fffcf0] text-slate-800 shadow-slate-300/50 ';
      if (isOrnate) base += 'border-[12px] border-emerald-800 ';
      else if (isMinimal) base += 'border-0 ';
      else if (settings.borderStyle === BorderStyle.Solid) base += 'border-4 border-emerald-800 ';
      else if (settings.borderStyle === BorderStyle.Dashed) base += 'border-4 border-dashed border-emerald-800 ';
      else if (settings.borderStyle === BorderStyle.Dotted) base += 'border-4 border-dotted border-emerald-800 ';
    }
    
    return base;
  };

  const isOrnate = settings.borderStyle === BorderStyle.Ornate;

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto pt-4 pb-32 px-4 no-scrollbar touch-pan-y mushaf-view-container"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div 
        id="mushaf-page"
        className={getBorderClasses()}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {loading ? (
            <motion.div 
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-inherit rounded-[0.5rem] z-20"
            >
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-emerald-500 font-bold animate-pulse">Memuat Halaman {page}...</p>
            </motion.div>
          ) : (
            <motion.div
              key={page}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full h-full relative"
            >
              {/* Bookmark Ribbon */}
              {isBookmarked && (
                <div className="absolute top-[-80px] md:top-[-110px] right-4 md:right-12 z-30 no-print">
                   <div className="relative w-10 h-16 bg-amber-500 shadow-lg flex items-center justify-center pt-2 rounded-b-sm">
                      <Bookmark size={20} className="text-white fill-current" />
                      <div className="absolute bottom-[-10px] left-0 w-0 h-0 border-l-[20px] border-l-amber-500 border-b-[10px] border-b-transparent"></div>
                      <div className="absolute bottom-[-10px] right-0 w-0 h-0 border-r-[20px] border-r-amber-500 border-b-[10px] border-b-transparent"></div>
                   </div>
                </div>
              )}

              {/* Bookmark Action Button */}
              <button 
                onClick={onToggleBookmark}
                title={isBookmarked ? "Hapus Penanda" : "Tandai Halaman Ini"}
                className={`absolute top-[-60px] md:top-[-90px] right-[-30px] md:right-[-60px] z-40 p-2 rounded-full transition-all no-print ${
                  isBookmarked 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                  : isDark ? 'bg-neutral-800 text-neutral-500 hover:text-amber-500' : 'bg-slate-100 text-slate-400 hover:text-amber-600'
                }`}
              >
                <Bookmark size={24} className={isBookmarked ? 'fill-current' : ''} />
              </button>

              <div 
                className="quran-text flex-1 relative z-10" 
                style={{ 
                  fontSize: `${settings.fontSize}px`,
                  fontFamily: `${settings.fontFamily}, serif`,
                  lineHeight: settings.fontFamily.includes('Nastaleeq') || settings.fontFamily === 'Hanafi' ? 2.8 : 2.2
                }}
              >
                {renderContent()}
              </div>
              
              <div className="mt-16 flex flex-col items-center justify-center gap-2 select-none opacity-80 border-t-2 pt-8 border-emerald-500/10 relative z-10">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent flex-1"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-600 mb-1">Halaman</span>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{toArabicNumerals(page)}</span>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent flex-1"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Frame Overlays - Visible only if Ornate is selected */}
        {isOrnate && (
          <>
            <div className={`absolute inset-2 border-2 rounded-sm pointer-events-none ${isDark ? 'border-amber-500/30' : 'border-amber-600/40'}`}></div>
            {/* Diubah dari -inset-1 ke inset-0 agar tidak keluar dari area capture */}
            <div className={`absolute inset-0 border-[4px] pointer-events-none opacity-40 ${isDark ? 'border-emerald-500/20' : 'border-emerald-700/20'}`}></div>

            {/* Ornate Corner Ornaments */}
            <div id="ornament-top-left" className="absolute top-4 left-4 w-20 h-20 pointer-events-none overflow-hidden">
              <div className={`absolute top-2 left-2 w-12 h-12 border-t-8 border-l-8 rounded-tl-2xl ${isDark ? 'border-amber-500/50' : 'border-amber-600/70'}`}></div>
              <div className={`absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 ${isDark ? 'border-emerald-400/40' : 'border-emerald-800/40'}`}></div>
            </div>
            <div id="ornament-top-right" className="absolute top-4 right-4 w-20 h-20 pointer-events-none overflow-hidden">
              <div className={`absolute top-2 right-2 w-12 h-12 border-t-8 border-r-8 rounded-tr-2xl ${isDark ? 'border-amber-500/50' : 'border-amber-600/70'}`}></div>
              <div className={`absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 ${isDark ? 'border-emerald-400/40' : 'border-emerald-800/40'}`}></div>
            </div>
            <div id="ornament-bottom-left" className="absolute bottom-4 left-4 w-20 h-20 pointer-events-none overflow-hidden">
              <div className={`absolute bottom-2 left-2 w-12 h-12 border-b-8 border-l-8 rounded-bl-2xl ${isDark ? 'border-amber-500/50' : 'border-amber-600/70'}`}></div>
              <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 ${isDark ? 'border-emerald-400/40' : 'border-emerald-800/40'}`}></div>
            </div>
            <div id="ornament-bottom-right" className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none overflow-hidden">
              <div className={`absolute bottom-2 right-2 w-12 h-12 border-b-8 border-r-8 rounded-br-2xl ${isDark ? 'border-amber-500/50' : 'border-amber-600/70'}`}></div>
              <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 ${isDark ? 'border-emerald-400/40' : 'border-emerald-800/40'}`}></div>
            </div>

            {/* Side Decorative Lines */}
            <div id="ornament-side-left" className={`absolute top-24 bottom-24 left-3 w-px opacity-30 ${isDark ? 'bg-amber-500/50' : 'bg-amber-600/50'}`}></div>
            <div id="ornament-side-right" className={`absolute top-24 bottom-24 right-3 w-px opacity-30 ${isDark ? 'bg-amber-500/50' : 'bg-amber-600/50'}`}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default MushafView;
