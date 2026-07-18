"use client";
import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "../common/Loader";

const PagesTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("slug", {
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Slug
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Title
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          Published
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor("slug", {
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <Link href={`/admin/adminPages/details?slug=${info.getValue()}`}>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <Link href={`/admin/adminPages/addEdit?id=${info.getValue()}`}>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => handleDelete(info.row.original.id)}
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
      // pagination: {
      //   pageSize: 5,
      // },
    },
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Pages deleted successfully!");
          // Update the local state to remove the deleted item from the table
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          const errorData = await response.json();
          console.error("Error deleting Pages:", errorData);
          alert("Failed to delete the Pages. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting Pages:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        window.location.reload();
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`);
        const result = await response.json();
        setData(result.pages || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dynamic Pages
          </h2>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search all columns..."
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-12 pr-4.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
            </div>
            <Link href="/admin/adminPages/addEdit">
              <button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Add Pages
              </button>
            </Link>
          </div>
        </div>

        <div className="border dark:border-gray-700 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
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
      </div>
    </div>
  );
};

export default PagesTable;
