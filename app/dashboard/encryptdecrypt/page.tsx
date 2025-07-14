'use client';

import { useState, useCallback, useEffect } from 'react';
import { encryptImage, decryptImage, getUserStatus } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, FileImage, X, CircleCheck, Circle, ShieldAlert, Clock, AlertTriangle, Lock, Unlock, KeyRound, LockKeyhole, Shield } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

export default function ClientPage() {
  // State untuk file dan kunci enkripsi
  const [encryptFile, setEncryptFile] = useState<File | null>(null);
  const [encryptKey, setEncryptKey] = useState('');
  const [encryptFilename, setEncryptFilename] = useState('encrypted');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [tempEncryptedBlob, setTempEncryptedBlob] = useState<Blob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State untuk file dan kunci dekripsi
  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptUrl, setDecryptUrl] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [tempDecryptedBlob, setTempDecryptedBlob] = useState<Blob | null>(null);
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false);
  
  // State untuk mode aplikasi
  const [mode, setMode] = useState<'basic' | 'advance'>('basic');
  const [showModeDescription, setShowModeDescription] = useState(true);

  // State untuk pengelolaan blokir pengguna
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('00:00');
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');

  // Fungsi untuk memformat waktu blokir yang tersisa
  const formatTimeRemaining = (until: Date) => {
    const now = new Date();
    const diff = until.getTime() - now.getTime();
    if (diff <= 0) return '00:00';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Callback untuk menangani drop file enkripsi
  const onEncryptDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setEncryptFile(acceptedFiles[0]);
  }, []);

  // Setup dropzone untuk file enkripsi
  const {
    getRootProps: getEncryptRootProps,
    getInputProps: getEncryptInputProps,
    isDragActive: isEncryptDragActive,
  } = useDropzone({ 
    onDrop: onEncryptDrop, 
    accept: { 'image/*': [] }, 
    maxFiles: 1 
  });

  // Callback untuk menangani drop file dekripsi
  const onDecryptDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setDecryptFile(acceptedFiles[0]);
  }, []);

  // Setup dropzone untuk file dekripsi
  const {
    getRootProps: getDecryptRootProps,
    getInputProps: getDecryptInputProps,
    isDragActive: isDecryptDragActive,
  } = useDropzone({ 
    onDrop: onDecryptDrop, 
    accept: { '*/*': [] }, 
    maxFiles: 1 
  });

  // Fungsi untuk menangani proses enkripsi
  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi file dan kekuatan kunci
    if (!encryptFile || getKeyStrength(encryptKey).score < 3) {
      toast.error('Key harus minimal 8 karakter, ada huruf besar, angka, dan simbol!');
      return;
    }

    // Persiapkan data untuk dikirim ke API
    const formData = new FormData();
    formData.append('file', encryptFile);
    formData.append('key', encryptKey);
    formData.append('save', 'false');

    setIsEncrypting(true);
    try {
      // Kirim permintaan enkripsi ke server dengan mode yang dipilih
      const result = await encryptImage(formData, mode === 'advance' ? 'advanced' : 'basic');
      setTempEncryptedBlob(result);
      setIsDialogOpen(true);
    } catch {
      toast.error('Gagal mengenkripsi file.');
      setIsEncrypting(false);
    }
  };

  // Fungsi untuk menangani proses dekripsi
  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi file dan kunci
    if (!decryptFile || decryptKey.length < 8) {
      toast.error('Key minimal 8 karakter!');
      return;
    }
  
    // Persiapkan data untuk dikirim ke API
    const formData = new FormData();
    formData.append('file', decryptFile);
    formData.append('key', decryptKey);
  
    setIsDecrypting(true);
    try {
      // Kirim permintaan dekripsi ke server dengan mode yang dipilih
      const result = await decryptImage(formData, mode === 'advance' ? 'advanced' : 'basic');
      setTempDecryptedBlob(result);
      const url = URL.createObjectURL(result);
      setDecryptUrl(url);
      setIsDecryptDialogOpen(true);
      toast.success('Dekripsi berhasil!');
    } catch (error: any) {
      let errorMessage = 'Key salah atau file tidak valid.';
  
      // Penanganan error khusus untuk respons blob
      if (error?.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text(); // Ubah blob jadi string
          const parsed = JSON.parse(text); // Parse ke JSON
  
          // Penanganan jika akun diblokir
          if (parsed.block_until) {
            const blockUntilDate = new Date(parsed.block_until);
            setIsBlocked(true);
            setBlockUntil(blockUntilDate);
            setBlockedMessage(parsed.error || 'Akun Anda diblokir sementara. Coba lagi nanti.');
            setIsBlockedDialogOpen(true);
            return;
          }
  
          errorMessage = parsed.error || errorMessage;
        } catch {
          errorMessage = 'Terjadi kesalahan saat membaca pesan error.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
  
      toast.error(errorMessage);
    } finally {
      setIsDecrypting(false);
    }
  };
  
  // Fungsi untuk menghitung kekuatan kunci
  const getKeyStrength = (key: string) => {
    const checks = {
      length: key.length >= 8,
      uppercase: /[A-Z]/.test(key),
      number: /[0-9]/.test(key),
      symbol: /[^A-Za-z0-9]/.test(key)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let color = 'bg-red-500';
    if (score === 2) color = 'bg-orange-400';
    else if (score === 3) color = 'bg-yellow-500';
    else if (score === 4) color = 'bg-green-500';

    return { score, color, checks };
  };

  // Fungsi untuk mendapatkan label kekuatan kunci
  const getKeyStrengthLabel = (score: number) => {
    if (score <= 1) return { label: 'Sangat Lemah', color: 'text-red-500' };
    if (score === 2) return { label: 'Lemah', color: 'text-orange-400' };
    if (score === 3) return { label: 'Kurang Kuat', color: 'text-yellow-500' };
    if (score === 4) return { label: 'Kuat', color: 'text-green-600' };
    return { label: '', color: '' };
  };

  // Fungsi untuk mendapatkan pesan kekurangan key
  const getKeyRequirements = (checks: { length: boolean; uppercase: boolean; number: boolean; symbol: boolean }) => {
    const requirements = [];
    if (!checks.length) requirements.push('minimal 8 karakter');
    if (!checks.uppercase) requirements.push('huruf besar');
    if (!checks.number) requirements.push('angka');
    if (!checks.symbol) requirements.push('simbol');
    return requirements;
  };

  // Hitung kekuatan kunci saat ini
  const keyStrength = getKeyStrength(encryptKey);
  const keyStrengthLabel = getKeyStrengthLabel(keyStrength.score);

  // Effect untuk memeriksa status pengguna saat komponen dimuat
  useEffect(() => {
    async function checkUserStatus() {
      try {
        const status = await getUserStatus();
        if (status.status === 'blocked') {
          setIsBlocked(true);
          const blockUntilDate = new Date(status.block_until);
          setBlockUntil(blockUntilDate);
          setBlockedMessage('Akun Anda diblokir sementara. Silakan coba lagi nanti.');
        }
      } catch (e) {
        // Penanganan error opsional
      }
    }
    checkUserStatus();
  }, []);

  // Effect untuk menghitung mundur waktu blokir
  useEffect(() => {
    if (!isBlocked || !blockUntil) return;

    // Fungsi untuk memperbarui timer
    const updateTimer = () => {
      const remaining = formatTimeRemaining(blockUntil);
      setTimeRemaining(remaining);
      
      // Reset status blokir jika waktu sudah habis
      if (remaining === '00:00') {
        setIsBlocked(false);
        setBlockUntil(null);
      }
    };

    // Panggil sekali di awal untuk menghindari delay
    updateTimer();
    
    // Set interval untuk update setiap detik
    const interval = setInterval(updateTimer, 1000);
    
    // Cleanup interval saat komponen unmount
    return () => clearInterval(interval);
  }, [isBlocked, blockUntil]);

  return (
    <main className="min-h-screen px-4">
      <div className="font-bold text-2xl mb-6 tracking-tight text-primary drop-shadow-sm text-center">ENCRYPT & DECRYPT</div>
      <div className="max-w-5xl mx-auto">
        {/* Tombol pemilihan mode */}
        <div className="flex justify-center gap-2 mb-8">
          <Button 
            variant={mode === 'basic' ? 'default' : 'outline'}
            onClick={() => {
              setMode('basic');
              setShowModeDescription(true);
            }}
            className={mode === 'basic' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {mode === 'basic' ? <CircleCheck className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
            Basic
          </Button>
          <Button
            variant={mode === 'advance' ? 'default' : 'outline'} 
            onClick={() => {
              setMode('advance');
              setShowModeDescription(true);
            }}
            className={mode === 'advance' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {mode === 'advance' ? <CircleCheck className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
            Advance
          </Button>
        </div>
       {showModeDescription && (
          <div className="mb-8 max-w-3xl mx-auto transition-all duration-300 ease-in-out">
            <div className="relative rounded-xl border bg-white p-5 shadow-sm">
              <button
                onClick={() => setShowModeDescription(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
                aria-label="Tutup deskripsi"
              >
                ×
              </button>
        
              <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
                {mode === 'basic' ? 'Mode Basic 🔐' : 'Mode Advance 🔒'}
              </h3>
        
              <p className="text-sm md:text-base text-slate-600">
                {mode === 'basic'
                  ? 'File akan dienkripsi menggunakan 3 lapis keamanan yang ringan dan efisien. Cocok untuk penggunaan umum dengan standar keamanan yang baik.'
                  : 'Menggunakan total 4 lapis enkripsi berstandar tinggi, mode ini dirancang untuk memberikan perlindungan maksimal pada data sensitif.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel Enkripsi */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Encrypt File</h2>
            </div>
            <form onSubmit={handleEncrypt} className="space-y-4">
              {/* Area drop file enkripsi */}
              <div
                {...getEncryptRootProps()}
                className={clsx(
                  'border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer',
                  isEncryptDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                )}
              >
                <input {...getEncryptInputProps()} />
                <p className="text-gray-500">Drag and drop gambar di sini, atau klik untuk upload</p>
              </div>
              
              {/* Preview gambar yang akan dienkripsi */}
              {encryptFile && (
                <div className="relative mt-4">
                  <img
                    src={URL.createObjectURL(encryptFile)}
                    alt="Encrypt Preview"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEncryptFile(null)}
                    className="absolute top-0 right-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Input kunci enkripsi dengan indikator kekuatan */}
              <div className="space-y-1">
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Masukkan kunci (min 8 karakter, huruf besar, angka, simbol)"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                {/* Bar indikator kekuatan kunci */}
                <div className="w-full h-2 rounded-full bg-gray-200 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all ${keyStrength.color}`}
                    style={{ width: `${(keyStrength.score / 4) * 100}%` }}
                  />
                </div>
                {/* Label kekuatan kunci dan detail requirements */}
                {encryptKey && (
                  <div className="space-y-1">
                    <div className={`text-xs font-semibold ${keyStrengthLabel.color}`}>
                      Kekuatan kunci: {keyStrengthLabel.label}
                    </div>
                    {keyStrength.score < 4 && (
                      <div className="text-xs text-gray-600">
                        Kurang: {getKeyRequirements(keyStrength.checks).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tombol enkripsi */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isEncrypting || !encryptFile || keyStrength.score < 3}
              >
                {isEncrypting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Encrypt'}
              </Button>
            </form>
          </div>

          {/* Panel Dekripsi */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Unlock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Decrypt File</h2>
            </div>
            <form onSubmit={handleDecrypt} className="space-y-4">
              {/* Area drop file dekripsi */}
              <div
                {...getDecryptRootProps()}
                className={clsx(
                  'border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer',
                  isDecryptDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
                )}
              >
                <input {...getDecryptInputProps()} />
                <p className="text-gray-500">Drag and drop file enkripsi di sini, atau klik untuk upload</p>
              </div>

              {/* Informasi file yang akan didekripsi */}
              {decryptFile && (
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
                  <FileImage className="w-5 h-5 text-green-600" />
                  <span>{decryptFile.name}</span>
                  <Button size="icon" variant="ghost" onClick={() => setDecryptFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Input kunci dekripsi */}
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Masukkan kunci"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              
              {/* Tombol dekripsi */}
              <Button
                type="submit"
                className={`w-full ${isBlocked ? 'bg-red-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                disabled={isDecrypting || !decryptFile || decryptKey.length < 8 || isBlocked}
              >
                {isDecrypting ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                ) : isBlocked ? (
                  'Blocked'
                ) : (
                  'Decrypt'
                )}
              </Button>
              
              {/* Informasi blokir jika pengguna diblokir */}
              {isBlocked && blockUntil && (
                <div className="text-red-500 text-sm text-center">
                  ⚠️ Terlalu banyak percobaan gagal. Tersisa: {timeRemaining}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Dialog hasil enkripsi */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsEncrypting(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Hasil Enkripsi</DialogTitle>
          </DialogHeader>

          {encryptFile && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 border p-3 rounded-lg bg-gray-100">
                <FileImage className="w-5 h-5 text-blue-500" />
                <div className="text-sm text-gray-800">{encryptFile.name}</div>
              </div>
              <Input
                type="text"
                placeholder="Nama file (tanpa ekstensi)"
                value={encryptFilename}
                onChange={(e) => setEncryptFilename(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="flex justify-end mt-4">
            <Button
              onClick={() => {
                if (!tempEncryptedBlob) return;
                const url = URL.createObjectURL(tempEncryptedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${encryptFilename || 'encrypted'}.img`;
                a.click();
                URL.revokeObjectURL(url);
                setIsDialogOpen(false);
                setIsEncrypting(false);
                toast.success('Berhasil didownload.');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog hasil dekripsi */}
      <Dialog open={isDecryptDialogOpen} onOpenChange={setIsDecryptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Hasil Dekripsi</DialogTitle>
          </DialogHeader>
          {decryptUrl && (
            <div className="mt-4">
              <div className="relative aspect-square w-full">
                <img
                  src={decryptUrl}
                  alt="Decrypted"
                  className="absolute w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDecryptDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (!tempDecryptedBlob) return;
                const url = URL.createObjectURL(tempDecryptedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'decrypted.jpg';
                a.click();
                URL.revokeObjectURL(url);
                toast.success('File berhasil didownload.');
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog informasi blokir */}
      <Dialog open={isBlockedDialogOpen} onOpenChange={setIsBlockedDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="h-6 w-6" />
              <span>Anda Diblokir Sementara</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Demi keamanan akun Anda, kami telah membatasi akses untuk sementara waktu.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-4 rounded-lg my-2">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-1">Terlalu Banyak Percobaan</h3>
              <p className="text-center text-red-600 text-sm mb-2">
                {blockedMessage}
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
              onClick={() => setIsBlockedDialogOpen(false)}
              className="border-slate-300 hover:bg-slate-100 w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
