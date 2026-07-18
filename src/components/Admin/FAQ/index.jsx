"use client";
import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Sample data structure remains the same
const data = [
  {
    id: 1,
    title: 'Privacy Policy',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-21',
  },
  {
    id: 2,
    title: 'Terms & Condition',
    createdAt: '2024-12-19',
    updatedAt: '2024-12-20',
  },
  {
    id: 3,
    title: 'Contact Us',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-21',
  },
];

const TableOne = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('title', {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Title
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Created
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Updated
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleEdit(info.getValue())}
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleEdit(info.getValue())}
          >
            <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => handleDelete(info.getValue())}
          >
            <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
          </button>
        </div>
      ),
      enableSorting: false,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleEdit = (id) => {
    console.log('Edit blog:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete blog:', id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-card">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">FAQ Table</h2>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search all columns..."
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-12 pr-4.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"

              />
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
            </div>
            <Link
              href="/admin/pages/FAQ/addEdit"
              className="inline-flex items-center"
            >
              <button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </button>
            </Link>
          </div>
        </div>

        <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOne;