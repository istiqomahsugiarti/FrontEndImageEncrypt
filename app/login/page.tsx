'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser({ email, password });
      toast.success('Login berhasil!');
      router.push('/dashboard/encryptdecrypt');
    } catch {
      toast.error('Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5ff] to-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Ornamen background */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#4880FF]/10 rounded-full blur-2xl z-0"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#4880FF]/20 rounded-full blur-2xl z-0"></div>
        {/* Logo dan judul */}
        <div className="flex flex-col items-center z-10 relative">
          <img
            src="/picrypt_icon.png"
            alt="Logo Picrypt"
            className="w-15 h-20 mb-2 drop-shadow-lg animate-fade-in"
            style={{ animation: 'fade-in 1s' }}
          />
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
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4880FF] transition"
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4880FF] hover:bg-[#3566d6] text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
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
              'Login'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center z-10 relative">
          <a
            href="/register"
            className="text-[#4880FF] hover:underline font-medium transition"
          >
            Belum punya akun? <span className="underline">Daftar disini</span>
          </a>
        </div>
        {/* Footer kecil */}
        <div className="mt-8 text-xs text-slate-400 text-center z-10 relative">
          © {new Date().getFullYear()} Picrypt. Aman, mudah, dan cepat.
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </main>
  );
}
