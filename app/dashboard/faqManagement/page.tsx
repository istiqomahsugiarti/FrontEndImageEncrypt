"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { getAllFaq, addFaq, updateFaq, deleteFaq } from "@/utils/api";
import { Plus, Edit2, Trash2, RefreshCcw, HelpCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Faq {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="py-4">
        <div className="flex gap-4 animate-pulse">
          <div className="h-4 w-8 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

function FaqTableSkeleton() {
  // Skeleton untuk loading tabel FAQ
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">No</TableHead>
            <TableHead>Pertanyaan</TableHead>
            <TableHead>Jawaban</TableHead>
            <TableHead className="w-32 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4].map((i) => (
            <TableRow key={i}>
              <TableCell className="text-center"><Skeleton className="mx-auto w-8 h-4" /></TableCell>
              <TableCell><Skeleton className="w-40 h-4" /></TableCell>
              <TableCell><Skeleton className="w-56 h-4" /></TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="w-7 h-7 rounded" />
                  <Skeleton className="w-7 h-7 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function FaqManagementPage() {
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [form, setForm] = useState({ pertanyaan: "", jawaban: "" });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch FAQ
  const fetchFaq = async () => {
    setLoading(true);
    try {
      const data = await getAllFaq();
      setFaqList(data);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat FAQ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  // Handle open add/edit dialog
  const handleOpenDialog = (faq?: Faq) => {
    if (faq) {
      setEditFaq(faq);
      setForm({ pertanyaan: faq.pertanyaan, jawaban: faq.jawaban });
    } else {
      setEditFaq(null);
      setForm({ pertanyaan: "", jawaban: "" });
    }
    setOpenDialog(true);
  };

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editFaq) {
        await updateFaq(editFaq.id, form);
        toast.success("FAQ berhasil diupdate", { position: "top-right" });
      } else {
        await addFaq(form);
        toast.success("FAQ berhasil ditambah", { position: "top-right" });
      }
      setOpenDialog(false);
      fetchFaq();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan FAQ", { position: "top-right" });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete (open modal)
  const handleDelete = (faqId: number) => {
    const faq = faqList.find(f => f.id === faqId) || null;
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteFaq(faqToDelete.id);
      toast.success("FAQ berhasil dihapus", { position: "top-right" });
      setShowDeleteModal(false);
      setFaqToDelete(null);
      fetchFaq();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus FAQ", { position: "top-right" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter FAQs based on search term
  const filteredFaq = faqList.filter(faq => 
    faq.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.jawaban.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFaq.length / itemsPerPage);
  const paginatedFaq = filteredFaq.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-2 py-2 px-2">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 mb-6">
        <span className="rounded-full bg-primary/10 p-2">
          <HelpCircle className="h-6 w-6 text-primary" />
        </span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">FAQ Management</h1>
      </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFaq}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
            title="Refresh FAQ"
          >
            <RefreshCcw className="h-5 w-5 text-slate-600" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari FAQ"
              className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Dialog Tambah/Edit FAQ */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
              <DialogHeader className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <DialogTitle className="text-blue-700 flex items-center gap-2 text-xl font-semibold mb-1">
                  {editFaq ? (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Edit FAQ
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Tambah FAQ
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                <div>
                  <Label className="mb-2" htmlFor="pertanyaan">Pertanyaan</Label>
                  <Input
                    id="pertanyaan"
                    name="pertanyaan"
                    value={form.pertanyaan}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Bagaimana cara mengenkripsi gambar?"
                    disabled={saving}
                    autoFocus
                  />
                </div>
                <div>
                  <Label className="mb-2" htmlFor="jawaban">Jawaban</Label>
                  <textarea
                    id="jawaban"
                    name="jawaban"
                    value={form.jawaban}
                    onChange={handleChange}
                    required
                    placeholder="Tulis jawaban yang jelas dan singkat..."
                    disabled={saving}
                    className="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
                  />
                </div>
                <DialogFooter className="gap-2 px-0 pb-0 mt-6 flex flex-col-reverse sm:flex-row">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={saving} className="w-1/2 border-slate-300 hover:bg-slate-100">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="w-1/2 bg-[#4880FF] hover:bg-[#E7EEFF] hover:text-[#4880FF]"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Menyimpan...
                      </span>
                    ) : editFaq ? (
                      <span className="flex items-center font-bold gap-2 justify-center"><Edit2 className="w-4 h-4" /> Update</span>
                    ) : (
                      <span className="flex items-center font-bold gap-2 justify-center"><Plus className="w-4 h-4" /> Tambah</span>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="sm" className="gap-2  bg-[#4880FF] hover:bg-[#E7EEFF] font-bold hover:text-[#4880FF] ">
                <Plus className="w-4 h-4" /> Tambah FAQ
              </Button>
            </DialogTrigger>
          </Dialog>
          {/* Dialog Hapus FAQ */}
          <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
              <DialogHeader className="bg-red-50 px-6 py-4 border-b border-red-100">
                <DialogTitle className="text-red-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                  Hapus FAQ
                </DialogTitle>
              </DialogHeader>
              <div className="px-6 py-6 text-center">
                <p className="text-base text-slate-800 font-semibold mb-2">Apakah Anda yakin ingin menghapus FAQ ini?</p>
                <p className="text-sm text-slate-500 mb-4">Tindakan ini <span className="font-semibold text-red-600">tidak dapat dibatalkan</span>. Data FAQ akan hilang secara permanen.</p>
              </div>
              <DialogFooter className="gap-2 px-6 pb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 border-slate-300 hover:bg-slate-100"
                  type="button"
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  className="w-1/2"
                  disabled={deleteLoading}
                  type="button"
                >
                  {deleteLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Menghapus...
                    </span>
                  ) : 'Hapus'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Table */}
      {loading ? (
        <FaqTableSkeleton />
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">No</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Jawaban</TableHead>
                <TableHead className="w-32 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaq.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    {searchTerm ? "Tidak ada FAQ yang sesuai pencarian" : "Belum ada FAQ"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFaq.map((faq, idx) => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-center font-medium">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                    <TableCell className="max-w-xs whitespace-pre-line break-words">{faq.pertanyaan}</TableCell>
                    <TableCell className="max-w-xs whitespace-pre-line break-words">{faq.jawaban}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenDialog(faq)}
                          className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-[#4880FF] text-white hover:bg-[#E7EEFF] font-bold hover:text-[#4880FF]"
              >
                Sebelumnya
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    page === currentPage
                      ? 'bg-[#4880FF] text-white border-2 border-[#4880FF] font-extrabold shadow-md hover:bg-[#4880FF] hover:text-white'
                      : 'bg-white text-[#4880FF] border border-[#4880FF] font-bold hover:bg-[#E7EEFF] hover:text-[#4880FF]'
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-[#4880FF] text-white hover:bg-[#E7EEFF] font-bold hover:text-[#4880FF]"
              >
                Berikutnya
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}