
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, Wifi, Loader2 } from 'lucide-react';
import { APP_PASSWORD } from '../constants';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userIp, setUserIp] = useState<string>('Detecting...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check local storage for authorization
    const authStatus = localStorage.getItem('app_authorized');
    if (authStatus === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      fetchIp();
    }
  }, []);

  const fetchIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIp(data.ip);
    } catch (err) {
      setUserIp('Unavailable');
    }
  };

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Small delay for professional feel
    setTimeout(() => {
      if (password === APP_PASSWORD) {
        localStorage.setItem('app_authorized', 'true');
        setIsAuthorized(true);
      } else {
        setError('Password tidak sesuai. Silakan coba kembali.');
        setPassword('');
      }
      setLoading(false);
    }, 800);
  };

  if (isAuthorized === null) return null; // Initial check loading

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-slate-100 p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mb-8 shadow-inner">
            <ShieldCheck size={40} />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Verifikasi Akses</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Halaman ini dilindungi. Silakan masukkan kode akses untuk melanjutkan ke Mushaf Digital.
          </p>

          <form onSubmit={handleAuthorize} className="space-y-4">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className={`w-full bg-slate-50 border-2 py-4 pl-14 pr-6 rounded-2xl outline-none transition-all font-medium placeholder:text-slate-400 ${
                  error ? 'border-red-200 focus:border-red-500' : 'border-slate-100 focus:border-emerald-500'
                }`}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold animate-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Buka Aplikasi
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Wifi size={14} className="text-emerald-500" />
              <span>IP Terdeteksi: <span className="text-slate-600">{userIp}</span></span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
          Authorized Access Only • Digital Mushaf Edition
        </p>
      </div>
    </div>
  );
};

export default AuthGuard;
