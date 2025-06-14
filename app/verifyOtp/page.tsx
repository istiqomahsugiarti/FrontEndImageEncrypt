'use client';

import { Suspense } from 'react';
import VerifyOtpPage from './verify-otp';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f1f5ff] to-[#f8fafc] px-4">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-[#4880FF]/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#4880FF] animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
        <p className="text-sm text-[#4880FF] font-medium">Memuat halaman verifikasi...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
