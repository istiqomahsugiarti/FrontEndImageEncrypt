'use client'

import React, { useEffect, useState } from 'react'
import { fetchAllUsers, editUser, deleteUser } from '@/utils/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Eye, Edit2, Trash2, RefreshCcw, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  is_blocked: boolean
  login_is_blocked: boolean
}

function UsersTableSkeleton() {
  // Skeleton untuk loading tabel users
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">ID</TableHead>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell className="text-center"><Skeleton className="mx-auto w-8 h-4" /></TableCell>
              <TableCell className="text-center"><Skeleton className="mx-auto w-24 h-4" /></TableCell>
              <TableCell className="text-center"><Skeleton className="mx-auto w-40 h-4" /></TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="w-7 h-7 rounded" />
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editUserData, setEditUserData] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchAllUsers()
      setUsers(data.users)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    } catch {
      return dateString
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Hitung data yang akan ditampilkan berdasarkan halaman
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const InfoItem = ({
    label,
    value,
    isBreakable = false,
  }: {
    label: string
    value: React.ReactNode
    isBreakable?: boolean
  }) => (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${isBreakable ? 'break-all' : ''}`}>{value}</p>
    </div>
  )
  
  const StatusBadge = ({ label, active }: { label: string; active: boolean }) => (
    <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
      <span className="text-sm">{label}</span>
      <Badge
        variant={active ? 'default' : 'destructive'}
        className="text-xs px-2 py-0.5 rounded-sm"
      >
        {active ? 'Aktif' : 'Diblokir'}
      </Badge>
    </div>
  )
  
  const handleEditUser = (user: User) => {
    setEditUserData(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId)
    setShowDeleteModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUserData) return
    setEditLoading(true)
    try {
      await editUser(editUserData.id, {
        username: editUserData.username,
        email: editUserData.email,
        role: editUserData.role,
        is_blocked: editUserData.is_blocked,
      })
      toast.success("User berhasil diupdate", { position: "top-right" })
      setShowEditModal(false)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Gagal update user", { position: "top-right" })
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return
    setDeleteLoading(true)
    try {
      await deleteUser(deleteUserId)
      toast.success("User berhasil dihapus", { position: "top-right" })
      setShowDeleteModal(false)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Gagal hapus user", { position: "top-right" })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-2 py-2 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 mb-6">
        <span className="rounded-full bg-primary/10 p-2">
          <Users className="h-6 w-6 text-primary" />
        </span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Users Management</h1>
      </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
            title="Refresh users"
          >
            <RefreshCcw className="h-5 w-5 text-slate-600" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <UsersTableSkeleton />
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setViewUser(user)
                          setShowViewModal(true)
                        }}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
        </>
      )}

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
          <DialogHeader className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <DialogTitle className="text-blue-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              User Details
            </DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="px-6 py-6">
              <Card className="border-none shadow-none p-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    {/* Kiri */}
                    <div className="space-y-3">
                      <InfoItem label="ID Pengguna" value={viewUser.id} />
                      <InfoItem label="Username" value={viewUser.username} />
                      <InfoItem label="Email" value={viewUser.email} isBreakable />
                    </div>
                    {/* Kanan */}
                    <div className="space-y-3">
                      <InfoItem
                        label="Role"
                        value={
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
                            {viewUser.role}
                          </Badge>
                        }
                      />
                      <InfoItem label="Tanggal Bergabung" value={formatDate(viewUser.created_at)} />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <div className="space-y-2">
                          <StatusBadge label="Status Akun" active={!viewUser.is_blocked} />
                          <StatusBadge label="Status Login" active={!viewUser.login_is_blocked} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="gap-2 px-6 pb-6">
            <Button variant="outline" onClick={() => setShowViewModal(false)} className="w-full font-bold bg-[#4880FF] text-white hover:bg-[#E7EEFF] hover:text-[#4880FF] border-2 border-[#4880FF]">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <DialogHeader className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
            <DialogTitle className="text-emerald-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
              Edit User
            </DialogTitle>
          </DialogHeader>
          {editUserData && (
            <form onSubmit={handleEditSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUserData.username}
                  onChange={e => setEditUserData({ ...editUserData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUserData.email}
                  onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editUserData.role}
                  onChange={e => setEditUserData({ ...editUserData, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_blocked"
                  checked={editUserData.is_blocked}
                  onChange={e => setEditUserData({ ...editUserData, is_blocked: e.target.checked })}
                />
                <label htmlFor="is_blocked" className="text-sm">Blokir User</label>
              </div>
              <DialogFooter className="gap-2 mt-4">
                <Button type="submit" disabled={editLoading} className="w-full font-bold bg-[#4880FF] text-white hover:bg-[#E7EEFF] hover:text-[#4880FF] border-2 border-[#4880FF]">
                  {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <DialogHeader className="bg-red-50 px-6 py-4 border-b border-red-100">
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
              Hapus User
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6 text-center">
            <p className="text-base text-slate-800 font-semibold mb-2">Apakah Anda yakin ingin menghapus user ini?</p>
            <p className="text-sm text-slate-500 mb-4">Tindakan ini <span className="font-semibold text-red-600">tidak dapat dibatalkan</span>. Data user akan hilang secara permanen.</p>
          </div>
          <DialogFooter className="gap-2 px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)} 
              className="w-1/2 font-bold bg-white text-[#4880FF] border border-[#4880FF] hover:bg-[#E7EEFF] hover:text-[#4880FF]"
              type="button"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm} 
              className="w-1/2 font-bold bg-red-600 text-white hover:bg-red-700 border-2 border-red-600"
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
  )
}
