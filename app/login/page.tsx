'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, loginBlockStatus } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, MailWarning, ShieldAlert, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Block state
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('00:00');
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  // Format remaining time as MM:SS
  const formatTime = (until: Date) => {
    const now = new Date();
    const diff = until.getTime() - now.getTime();
    if (diff <= 0) return '00:00';
    const m = Math.floor(diff / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Check login block status on mount or when email changes
  useEffect(() => {
    // Cek email dari input atau dari localStorage jika ada
    const emailToCheck = email || localStorage.getItem('blockedEmail');
    if (!emailToCheck) return;
    
    async function checkBlock() {
      try {
        const res = await loginBlockStatus(emailToCheck || '');
        if (res.is_blocked && res.block_until) {
          setIsBlocked(true);
          const until = new Date(res.block_until);
          setBlockUntil(until);
          // Jika email dari localStorage dan tidak dari input, set email
          if (!email && emailToCheck) {
            setEmail(emailToCheck);
          }
          // Tampilkan dialog jika masih diblokir
          setShowBlockDialog(true);
        } else {
          // Jika tidak diblokir lagi, hapus dari localStorage
          localStorage.removeItem('blockedEmail');
        }
      } catch (e) {
        // ignore
      }
    }
    checkBlock();
  }, [email]);

  // Countdown effect
  useEffect(() => {
    if (!isBlocked || !blockUntil) return;
    const update = () => {
      const t = formatTime(blockUntil);
      setTimeRemaining(t);
      if (t === '00:00') {
        setIsBlocked(false);
        setBlockUntil(null);
        localStorage.removeItem('blockedEmail');
        setShowBlockDialog(false);
        // Refresh halaman saat timer mencapai 0
        window.location.reload();
      }
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [isBlocked, blockUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser({ email, password });
      toast.success('Login berhasil!');
      router.push('/dashboard/encryptdecrypt');
    } catch (err: any) {
      // parse block error
      const errorData = err.response?.data;
      
      if (errorData?.block_until) {
        setIsBlocked(true);
        const until = new Date(errorData.block_until);
        setBlockUntil(until);
        // Simpan email yang diblokir ke localStorage
        localStorage.setItem('blockedEmail', email);
        toast.error(errorData.error || 'Akun diblokir.');
        // Tampilkan dialog blokir
        setShowBlockDialog(true);
      } else {
        // Mengambil pesan error dari response
        const errorMessage = errorData?.error || 'Login gagal. Periksa email dan password.';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5ff] to-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#4880FF]/10 rounded-full blur-2xl z-0"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#4880FF]/20 rounded-full blur-2xl z-0"></div>
        <div className="flex flex-col items-center z-10 relative">
          <img src="/picrypt_icon.png" alt="Logo Picrypt" className="w-15 h-20 mb-2 drop-shadow-lg animate-fade-in" style={{ animation: 'fade-in 1s' }} />
          <h1 className="text-3xl font-extrabold mb-1 text-[#4880FF] tracking-tight drop-shadow-sm">Selamat Datang!</h1>
          <p className="text-slate-500 mb-6 text-center text-sm">Masuk ke akun <span className="font-semibold text-[#4880FF]">Picrypt</span> untuk melanjutkan</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 z-10 relative">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:ring-2 focus:ring-[#4880FF]/40"
          />
          <div className="relative">
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="focus:ring-2 focus:ring-[#4880FF]/40 pr-10"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4880FF] transition" tabIndex={-1}>
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4880FF] hover:bg-[#3566d6] text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || isBlocked}
          >
            {loading ? (
              <span>
                <svg className="inline mr-2 w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Sedang masuk...
              </span>
            ) : (
              isBlocked ? `Blocked (${timeRemaining})` : 'Login'
            )}
          </Button>
          {isBlocked && (
            <div className="text-red-500 text-sm text-center">
              <MailWarning className="inline mr-1" size={16} /> Terlalu Banyak Kesalahan Login . Tunggu {timeRemaining} lagi.
            </div>
          )}
        </form>
        <div className="mt-6 text-center z-10 relative">
          <a href="/register" className="text-[#4880FF] hover:underline font-medium transition">
            Belum punya akun? <span className="underline">Daftar disini</span>
          </a>
        </div>
        <div className="mt-8 text-xs text-slate-400 text-center z-10 relative">
          © {new Date().getFullYear()} Picrypt. Aman, mudah, dan cepat.
        </div>
      </div>

      {/* Dialog untuk pesan blokir */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="h-6 w-6" />
              <span>Anda Diblokir Sementara</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Demi keamanan akun Anda, kami telah membatasi akses login untuk sementara waktu.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-4 rounded-lg my-2">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-1">Terlalu Banyak Percobaan Login</h3>
              <p className="text-center text-red-600 text-sm mb-2">
                Sistem mendeteksi terlalu banyak percobaan login yang gagal dari akun ini.
              </p>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-red-200 w-full text-center">
                <p className="text-sm text-slate-600 mb-1">Akun akan dibuka kembali dalam:</p>
                <p className="text-2xl font-bold text-red-600">{timeRemaining}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowBlockDialog(false)}
              className="border-slate-300 hover:bg-slate-100 w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}  
          to { opacity: 1; transform: scale(1);}  
        }
      `}</style>
    </main>
  );
}
