'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, CheckCircle2, XCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Validate password on change
  useEffect(() => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setPasswordsMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const isFormValid = email && username && isPasswordValid && passwordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    try {
      const res = await registerUser({ email, password, username });
      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    } catch {
      toast.error('Registrasi gagal. Email mungkin sudah terdaftar.');
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
          <div className="w-20 h-20 bg-[#4880FF]/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-10 h-10 text-[#4880FF]" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#4880FF] tracking-tight drop-shadow-sm">Daftar Akun</h1>
          <p className="text-slate-500 mb-6 text-center text-sm max-w-sm">
            Buat akun <span className="font-semibold text-[#4880FF]">Picrypt</span> untuk mulai mengamankan file Anda
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 z-10 relative">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <Input
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
              className="focus:ring-2 focus:ring-[#4880FF]/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-[#4880FF]/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Buat password yang kuat"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

            {/* Password requirements - hanya muncul jika password tidak kosong */}
            {password && (
              <div className="mt-2 space-y-2 text-sm">
                <p className="text-gray-600 font-medium mb-1">Password harus memenuhi:</p>
                <div className="space-y-1.5">
                  {!hasMinLength && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={16} />
                      <span>Minimal 8 karakter</span>
                    </div>
                  )}
                  {!hasUpperCase && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={16} />
                      <span>Mengandung huruf besar</span>
                    </div>
                  )}
                  {!hasLowerCase && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={16} />
                      <span>Mengandung huruf kecil</span>
                    </div>
                  )}
                  {!hasNumber && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={16} />
                      <span>Mengandung angka</span>
                    </div>
                  )}
                  {!hasSpecialChar && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={16} />
                      <span>Mengandung karakter khusus (!@#$%^&*)</span>
                    </div>
                  )}
                  {isPasswordValid && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={16} />
                      <span>Password sudah memenuhi semua kriteria</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <div className="relative">
              <Input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Ulangi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`focus:ring-2 focus:ring-[#4880FF]/40 pr-10 ${
                  confirmPassword && !passwordsMatch ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4880FF] transition"
                tabIndex={-1}
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">Password tidak cocok</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4880FF] hover:bg-[#3566d6] text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed h-11"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="inline mr-2 w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Mendaftar...
              </span>
            ) : (
              'Daftar'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center z-10 relative">
          <a
            href="/login"
            className="text-[#4880FF] hover:underline font-medium transition inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Sudah punya akun? Login disini
          </a>
        </div>

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
