"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import Loader from "../common/Loader";

const UserTable = () => {
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState("");           // ✅ Search value
  const [debouncedSearch, setDebouncedSearch] = useState("");  // ✅ Debounced search
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // ✅ Separate search loader

  const [totalUsers, setTotalUsers] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("id", {
      header: "User ID",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => <div>{info.getValue() || "N/A"}</div>,
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
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${info.getValue() === "admin"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
            }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("isVerified", {
      header: "Email Verified",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${info.getValue()
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {info.getValue() ? "Yes" : "No"}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: Math.ceil(totalUsers / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ✅ Debounce function for efficient searching
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500), // ✅ 500ms delay
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        setIsSearching(true); // Show loading for search
      } else {
        setLoading(true);     // Show loading for pagination
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users?page=${pageIndex + 1
          }&limit=${pageSize}&search=${debouncedSearch}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result.users || []);
        setTotalUsers(result.totalUsers || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchData();
  }, [pageIndex, pageSize, debouncedSearch]);

  if (loading && !isSearching) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ✅ Search and Total Users */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <strong>Total Users:</strong> {totalUsers}
          </div>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value); // ✅ Debounce API call
              }}
              placeholder="Search by name, email, or phone..."
              className="w-full rounded-lg border border-gray-300 py-2 px-4 text-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500"
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
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4 gap-4">
        <button
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            setPageIndex((old) =>
              old + 1 < Math.ceil(totalUsers / pageSize) ? old + 1 : old
            )
          }
          disabled={pageIndex + 1 >= Math.ceil(totalUsers / pageSize)}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UserTable;
