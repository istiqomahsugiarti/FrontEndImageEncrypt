"use client"

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react"

interface User {
  username: string;
  email: string;
  created_at: string;
}

interface UserGrowthChartProps {
  users: User[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ users }) => {
  const [range, setRange] = useState("90d")

  // Fungsi untuk memfilter data berdasarkan range
  const filterDataByRange = (data: any[], range: string) => {
    const now = new Date();
    const filteredData = data.filter(item => {
      const [month, year] = item.month.split('/').map(Number);
      const itemDate = new Date(year, month - 1);
      
      switch (range) {
        case "7d":
          return now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "30d":
          return now.getTime() - itemDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case "90d":
          return now.getTime() - itemDate.getTime() <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    return filteredData;
  };

  // Mengelompokkan data berdasarkan bulan
  const monthlyData = users.reduce((acc: any[], user) => {
    const date = new Date(user.created_at);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const existingMonth = acc.find(item => item.month === monthYear);
    if (existingMonth) {
      existingMonth.count++;
    } else {
      acc.push({
        month: monthYear,
        count: 1
      });
    }
    
    return acc;
  }, []);

  // Mengurutkan data berdasarkan bulan
  monthlyData.sort((a, b) => {
    const [monthA, yearA] = a.month.split('/').map(Number);
    const [monthB, yearB] = b.month.split('/').map(Number);
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

  // Filter data berdasarkan range yang dipilih
  const filteredData = filterDataByRange(monthlyData, range);

  // Hitung total pengguna dalam range yang dipilih
  const totalUsersInRange = filteredData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Pertumbuhan Pengguna</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total {totalUsersInRange} pengguna dalam {range === "7d" ? "7 hari" : range === "30d" ? "30 hari" : "3 bulan"} terakhir
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(val) => val && setRange(val)}
        >
          <ToggleGroupItem value="90d">3 Bulan</ToggleGroupItem>
          <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
          <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const [month, year] = value.split('/');
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => {
                  const [month, year] = value.split('/');
                  const date = new Date(Number(year), Number(month) - 1);
                  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                }}
                formatter={(value: number) => [`${value} Pengguna`, 'Jumlah']}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
