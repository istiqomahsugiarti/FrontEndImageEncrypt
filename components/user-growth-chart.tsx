"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react"

const dataLast30Days = [
  { date: "Jun 1", users: 120 },
  { date: "Jun 2", users: 200 },
  { date: "Jun 3", users: 170 },
  { date: "Jun 4", users: 300 },
  { date: "Jun 5", users: 250 },
  { date: "Jun 6", users: 330 },
  { date: "Jun 7", users: 400 },
  // tambahkan data sesuai kebutuhan
]

export default function UserGrowthChart() {
  const [range, setRange] = useState("30d")

  // Dummy data sementara, nanti bisa pakai kondisi sesuai range
  const data = dataLast30Days

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Total Visitors</CardTitle>
          <p className="text-sm text-muted-foreground">Total for the last 3 months</p>
        </div>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(val) => val && setRange(val)}
        >
          <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
          <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
          <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#d1d5db" }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
