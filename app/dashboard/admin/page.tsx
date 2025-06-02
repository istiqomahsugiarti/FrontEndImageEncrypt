"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, LayoutDashboardIcon, AlertTriangle, History } from "lucide-react"
import UserGrowthChart from '@/components/user-growth-chart'
import { getDashboardData } from '@/utils/api'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-2 px-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="rounded-full bg-primary/10 p-2">
          <LayoutDashboardIcon className="h-6 w-6 text-primary" />
        </span>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Admin</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Pengguna */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Total Pengguna</div>
              <div className="text-2xl font-bold text-slate-800">{dashboardData?.total_users || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Total History */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-blue-100 p-3">
              <History className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Total History</div>
              <div className="text-2xl font-bold text-slate-800">{dashboardData?.total_history || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Login Failed */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Login Gagal</div>
              <div className="text-2xl font-bold text-slate-800">{dashboardData?.total_login_failed || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Decrypt Failed */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Decrypt Gagal</div>
              <div className="text-2xl font-bold text-slate-800">{dashboardData?.total_decrypt_failed || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Pertumbuhan User */}
      <div className="mb-6">
        <Card className="shadow-none border border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Grafik Pertumbuhan Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <UserGrowthChart users={dashboardData?.users || []} />
          </CardContent>
        </Card>
      </div>

      {/* Daftar Pengguna Terbaru */}
      <div>
        <Card className="shadow-none border border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Pengguna Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {dashboardData?.users?.slice(0, 5).map((user: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{user.username}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-400 mt-1">Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
