// pages/forgot-password.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp({ email });
      toast.success('Jika email terdaftar, kode OTP telah dikirim.');
      router.push(`/verifyOtp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim OTP, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5ff] to-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Ornamen Blur */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#4880FF]/10 rounded-full blur-2xl z-0"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#4880FF]/20 rounded-full blur-2xl z-0"></div>

        <div className="flex flex-col items-center z-10 relative">
          <div className="w-20 h-20 bg-[#4880FF]/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-10 h-10 text-[#4880FF]" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#4880FF] tracking-tight drop-shadow-sm">
            Lupa Kata Sandi
          </h1>
          <p className="text-slate-500 mb-6 text-center text-sm max-w-sm">
            Masukkan email Anda untuk menerima kode OTP. Kami akan mengirimkan instruksi untuk mereset kata sandi Anda.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4 z-10 relative">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Terdaftar
            </label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-[#4880FF]/40"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4880FF] hover:bg-[#3566d6] text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed h-11"
            disabled={loading || !email}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="inline mr-2 w-4 h-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Mengirim OTP...
              </span>
            ) : (
              'Kirim Kode OTP'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center z-10 relative">
          <a href="/login" className="text-[#4880FF] hover:underline font-medium transition inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Login
          </a>
        </div>

        <div className="mt-8 text-xs text-slate-400 text-center z-10 relative">
          © {new Date().getFullYear()} Picrypt. Aman, mudah, dan cepat.
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
