// pages/verify-otp.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromQuery = params.get('email') || '';

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setHasMinLength(newPassword.length >= 8);
    setHasUpperCase(/[A-Z]/.test(newPassword));
    setHasLowerCase(/[a-z]/.test(newPassword));
    setHasNumber(/[0-9]/.test(newPassword));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(newPassword));
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
  }, [newPassword, confirmPassword]);

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const isFormValid = isPasswordValid && passwordsMatch;

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otp.length < 6) {
      toast.error('Kode OTP harus 6 digit');
      setLoading(false);
      return;
    }
    if (!isPasswordValid) {
      toast.error('Password harus memenuhi semua kriteria');
      setLoading(false);
      return;
    }
    if (!passwordsMatch) {
      toast.error('Password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      await verifyOtp({ email, otp, new_password: newPassword });
      toast.success('Password berhasil direset! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Verifikasi OTP gagal');
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
            <KeyRound className="w-10 h-10 text-[#4880FF]" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#4880FF] tracking-tight drop-shadow-sm">
            Verifikasi OTP
          </h1>
          <p className="text-slate-500 mb-6 text-center text-sm max-w-sm">
            Masukkan kode OTP yang telah dikirim ke email <span className="font-semibold text-[#4880FF]">{email}</span> dan buat password baru Anda.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4 z-10 relative">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Terdaftar</label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kode OTP</label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              containerClassName="gap-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password Baru</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Buat password yang kuat"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="focus:ring-2 focus:ring-[#4880FF]/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4880FF] transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password requirements - hanya muncul jika password tidak kosong */}
            {newPassword && (
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
                type={showConfirmPassword ? 'text' : 'password'}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4880FF] transition"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">Password tidak cocok</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4880FF] hover:bg-[#3566d6] text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed h-11"
            disabled={loading || !email || !otp || !isFormValid}
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
                Memproses...
              </span>
            ) : (
              'Reset Password'
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
