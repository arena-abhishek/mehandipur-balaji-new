"use client";

import React, { useState, useEffect } from 'react';
// import {

// } from '@tanstack/react-table';
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TableOne = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]); // For API data
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [selectedRow, setSelectedRow] = useState(null); // For storing the selected row data

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/leads/`);
      const result = await response.json();
      setData(result.logs); // Update the state with the fetched logs
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(`/api/leads`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // setTableData((prevData) =>
        //   prevData.map((row) =>
        //     row.id === leadId ? { ...row, status: newStatus } : row
        //   )
        // );
        fetchData();


      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('phone', {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Phone
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Name
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('mainCategory.name', {
      header: 'Service',
      cell: (info) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Created
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {/* Format the date and time */}
          {new Date(info.getValue()).toLocaleString('en-US', {
            weekday: 'short',  // e.g., "Mon"
            year: 'numeric',   // e.g., "2025"
            month: 'short',    // e.g., "Apr"
            day: 'numeric',    // e.g., "13"
            hour: '2-digit',   // e.g., "05"
            minute: '2-digit', // e.g., "30"
            second: '2-digit', // e.g., "00"
            hour12: true,      // 12-hour clock
          })}
        </div>
      ),
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const leadId = info.row.original.id;
        return (
          <select
            value={info.getValue()}
            onChange={(e) => updateStatus(leadId, e.target.value)}
            className="border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleViewDetails(info.row.original)}
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });
  const handleViewDetails = (rowData) => {
    setSelectedRow(rowData);
    setIsDialogOpen(true);
  };
  const handleEdit = (id) => {
    // console.log('Edit lead:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete lead:', id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-card">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leads</h2>
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
          </div>
        </div>

        <div className="border dark:border-gray-700 rounded-lg overflow-x-auto">
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
        {isDialogOpen && selectedRow && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h3>
              <div className="mt-4">
                <p><strong>Name:</strong> {selectedRow.name}</p>
                <p><strong>Phone:</strong> {selectedRow.phone}</p>
                <p><strong>Status:</strong> {selectedRow.status}</p>
                <p><strong>Created At:</strong> {new Date(selectedRow.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOne;
