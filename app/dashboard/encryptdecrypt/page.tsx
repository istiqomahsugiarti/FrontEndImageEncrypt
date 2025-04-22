'use client';

import { useState, useCallback } from 'react';
import { encryptImage, decryptImage } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, FileImage, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

export default function ClientPage() {
  const [encryptFile, setEncryptFile] = useState<File | null>(null);
  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [encryptKey, setEncryptKey] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [encryptFilename, setEncryptFilename] = useState('encrypted');
  const [decryptUrl, setDecryptUrl] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempEncryptedBlob, setTempEncryptedBlob] = useState<Blob | null>(null);
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false);
  const [tempDecryptedBlob, setTempDecryptedBlob] = useState<Blob | null>(null);

  const onEncryptDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setEncryptFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getEncryptRootProps,
    getInputProps: getEncryptInputProps,
    isDragActive: isEncryptDragActive,
  } = useDropzone({
    onDrop: onEncryptDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const onDecryptDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDecryptFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getDecryptRootProps,
    getInputProps: getDecryptInputProps,
    isDragActive: isDecryptDragActive,
  } = useDropzone({
    onDrop: onDecryptDrop,
    accept: { '*/*': [] },
    maxFiles: 1,
  });

  const encryptWithSaveOption = async (save: boolean) => {
    if (!encryptFile || !encryptKey || !tempEncryptedBlob) return;

    const formData = new FormData();
    formData.append('file', encryptFile);
    formData.append('key', encryptKey);
    formData.append('save', save.toString());
    formData.append('filename', encryptFilename || 'encrypted');

    try {
      const result = await encryptImage(formData);
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${encryptFilename || 'encrypted'}.img`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(save ? 'Enkripsi dan simpan berhasil!' : 'Enkripsi berhasil!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengenkripsi.');
    } finally {
      setIsEncrypting(false);
      setIsDialogOpen(false);
    }
  };

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptFile || !encryptKey) return;

    const formData = new FormData();
    formData.append('file', encryptFile);
    formData.append('key', encryptKey);
    formData.append('save', 'false');

    setIsEncrypting(true);
    try {
      const result = await encryptImage(formData);
      setTempEncryptedBlob(result);
      setIsDialogOpen(true);
    } catch {
      toast.error('Gagal mengenkripsi file.');
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptFile || !decryptKey) return;

    const formData = new FormData();
    formData.append('file', decryptFile);
    formData.append('key', decryptKey);

    try {
      const result = await decryptImage(formData);
      setTempDecryptedBlob(result);
      const url = URL.createObjectURL(result);
      setDecryptUrl(url);
      setIsDecryptDialogOpen(true);
      toast.success('Dekripsi berhasil!');
    } catch {
      toast.error('Key salah atau file tidak valid.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Encrypt */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">🔒 Encrypt File</h2>
          <form onSubmit={handleEncrypt} className="space-y-4">
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

            {encryptFile && (
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
                <FileImage className="w-5 h-5 text-blue-600" />
                <span>{encryptFile.name}</span>
                <Button size="icon" variant="ghost" onClick={() => setEncryptFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Input
              type="text"
              placeholder="Masukkan kunci"
              value={encryptKey}
              onChange={(e) => setEncryptKey(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isEncrypting || !encryptFile || !encryptKey}
            >
              {isEncrypting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Encrypt'}
            </Button>
          </form>
        </div>

        {/* Decrypt */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-green-600 mb-4">🔓 Decrypt File</h2>
          <form onSubmit={handleDecrypt} className="space-y-4">
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

            {decryptFile && (
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
                <FileImage className="w-5 h-5 text-green-600" />
                <span>{decryptFile.name}</span>
                <Button size="icon" variant="ghost" onClick={() => setDecryptFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Input
              type="text"
              placeholder="Masukkan kunci"
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!decryptFile || !decryptKey}
            >
              Decrypt
            </Button>
          </form>
        </div>
      </div>

      {/* Encrypt Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsEncrypting(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Opsi dan Nama File</DialogTitle>
          </DialogHeader>

          {encryptFile && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 border p-3 rounded-lg bg-gray-100">
                <FileImage className="w-5 h-5 text-blue-500" />
                <div className="text-sm text-gray-800">{encryptFile.name}</div>
              </div>
              <Input
                type="text"
                placeholder="Masukkan nama file (tanpa ekstensi)"
                value={encryptFilename}
                onChange={(e) => setEncryptFilename(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-4">
            <Button
              variant="outline"
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
                toast.success('Berhasil didownload tanpa menyimpan.');
              }}
            >
              Download
            </Button>
            <Button onClick={() => encryptWithSaveOption(true)} className="bg-blue-600 hover:bg-blue-700">
              Download and Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decrypt Dialog */}
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
          <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-end mt-4">
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
    </main>
  );
}
