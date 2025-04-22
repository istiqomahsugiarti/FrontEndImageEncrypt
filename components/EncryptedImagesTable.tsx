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
import { fetchEncryptedImages } from '../utils/api';
import { Button } from './ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface EncryptedImage {
  id: string;
  filename: string;
  created_at: string;
  nomor: number;
}

const EncryptedImagesTable = () => {
  const [images, setImages] = useState<EncryptedImage[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: EncryptedImage[] = await fetchEncryptedImages();
        const numberedData = data.map((item, index) => ({ ...item, nomor: index + 1 }));
        setImages(numberedData);
      } catch (error) {
        console.error('Error fetching encrypted images:', error);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<EncryptedImage>[] = [
    {
      accessorKey: 'nomor',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          Nomor
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4" /> : null}
        </div>
      ),
    },
    {
      accessorKey: 'filename',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          Filename
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4" /> : null}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          Created At
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4" /> : null}
        </div>
      ),
      cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleString(),
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
  });

  return (
    <div className="w-full px-4 py-6">
      <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gray-100 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-left font-semibold text-gray-800"
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
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-3 text-gray-700 text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-gray-400">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EncryptedImagesTable;
