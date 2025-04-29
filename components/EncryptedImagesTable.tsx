'use client';
import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { getHistory } from '../utils/api';
import { Button } from './ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import * as XLSX from 'xlsx';

interface EncryptedImage {
  id: string;
  file_name: string;
  action: string;
  created_at: string;
  nomor: number;
  key:string;
}

const EncryptedImagesTable = () => {
  const [images, setImages] = useState<EncryptedImage[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: EncryptedImage[] = await getHistory();
        const numberedData = data.map((item, index) => ({ ...item, nomor: index + 1 }));
        setImages(numberedData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchData();
  }, []);

  // Palet warna yang lebih soft dan netral
  const columns: ColumnDef<EncryptedImage>[] = [
    {
      accessorKey: 'nomor',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-slate-700">No</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4 text-slate-400" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4 text-slate-400" /> : null}
        </div>
      ),
      size: 60,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-700">{row.getValue('nomor')}</span>
      ),
    },
    {
      accessorKey: 'file_name',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-slate-700">File Name</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4 text-slate-400" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4 text-slate-400" /> : null}
        </div>
      ),
      size: 260,
      cell: ({ row }) => (
        <span className="truncate max-w-[220px] block text-slate-800">{row.getValue('file_name')}</span>
      ),
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-slate-700">Action</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4 text-slate-400" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4 text-slate-400" /> : null}
        </div>
      ),
      size: 120,
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${row.getValue('action') === 'encrypt'
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : row.getValue('action') === 'decrypt'
            ? 'bg-sky-50 text-sky-600 border border-sky-100'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`
        }>
          {row.getValue('action') === 'encrypt' ? 'Enkripsi' : row.getValue('action') === 'decrypt' ? 'Dekripsi' : row.getValue('action')}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <span className="text-slate-700">Created At</span>
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4 text-slate-400" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4 text-slate-400" /> : null}
        </div>
      ),
      size: 180,
      cell: ({ row }) => (
        <span className="text-slate-600">{new Date(row.getValue('created_at')).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: images,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
  });

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(images);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Encrypted Images');
    XLSX.writeFile(workbook, 'encrypted_images.xlsx');
  };

  return (
    <div className="w-full px-2 py-6">
      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow bg-white">
        <Table className="min-w-[700px] text-[15px]">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: columns[idx]?.size ? `${columns[idx].size}px` : undefined,
                      minWidth: columns[idx]?.size ? `${columns[idx].size}px` : undefined,
                      maxWidth: columns[idx]?.size ? `${columns[idx].size + 40}px` : undefined,
                    }}
                    className="px-4 py-3 text-left font-semibold text-slate-700 uppercase tracking-wide border-b border-slate-200 bg-opacity-90"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={
                    `transition-all duration-150
                    ${index % 2 === 0
                      ? 'bg-white'
                      : 'bg-slate-50 hover:bg-slate-100'
                    }
                    hover:shadow-sm hover:scale-[1.01]`
                  }
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: columns[idx]?.size ? `${columns[idx].size}px` : undefined,
                        minWidth: columns[idx]?.size ? `${columns[idx].size}px` : undefined,
                        maxWidth: columns[idx]?.size ? `${columns[idx].size + 40}px` : undefined,
                      }}
                      className="px-4 py-3 text-slate-800 text-left align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-slate-400 font-semibold">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-1 gap-3">
        <div className="text-sm text-slate-600">
          Halaman <span className="font-semibold text-slate-700">{table.getState().pagination.pageIndex + 1}</span> dari <span className="font-semibold text-slate-700">{table.getPageCount()}</span>
        </div>
        <div className="space-x-2 flex">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToXLSX}
            className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Ekspor Key
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EncryptedImagesTable;
