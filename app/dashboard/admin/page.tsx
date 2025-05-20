import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, LayoutDashboardIcon } from "lucide-react"
import UserGrowthChart from '@/components/user-growth-chart'

export default function AdminDashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Pengguna */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Total Pengguna</div>
              <div className="text-2xl font-bold text-slate-800">1,234</div>
              <div className="text-xs text-green-600 mt-1">+12% <span className="text-slate-400">bulan lalu</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Aktivitas User */}
        <Card className="shadow-none border border-slate-200 bg-white hover:shadow transition-all">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-green-100 p-3">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Aktivitas User</div>
              <div className="text-2xl font-bold text-slate-800">892</div>
              <div className="text-xs text-green-600 mt-1">+8% <span className="text-slate-400">minggu lalu</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Placeholder untuk card ketiga jika ingin menambah info lain */}
        <Card className="shadow-none border border-slate-200 bg-white flex items-center justify-center text-slate-400">
          <CardContent className="flex flex-col items-center justify-center py-5">
            <span className="text-sm">Info Lainnya</span>
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
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas Terbaru */}
      <div>
        <Card className="shadow-none border border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">User baru mendaftar</p>
                  <p className="text-xs text-slate-400">2 menit yang lalu</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
