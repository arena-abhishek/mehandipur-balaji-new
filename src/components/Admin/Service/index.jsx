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
import { Plus, Pencil, Eye, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "../common/Loader";
import axios from "axios"; // Axios for making API calls

const ServiceTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("image", {
      header: "Image",
      cell: (info) => (
        info.getValue() ? (
          <div className="hidden sm:block w-12 h-12 relative">
            <img

              src={`${process.env.NEXT_PUBLIC_API_URL}/api${info.getValue()}`}


              // src={info.getValue()}
              alt="Image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <span className="text-gray-500 italic">No Image</span>
        )
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Name
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => <div className="font-medium text-gray-900 dark:text-white">{info.getValue()}</div>,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Status
          <ArrowUpDown className="w-4 h-4" />
        </div>
      ),
      cell: (info) => {
        const status = info.getValue(); // Get current status (either 'Published' or 'Inactive')

        // Handle status toggle
        // const handleToggle = async () => {

        //   // Call API to update the status in the database (adjust the URL and logic as needed)
        //   try {
        //     const formData = new FormData();

        //     const newStatus = status === 'published' ? 'Inactive' : 'published';
        //     formData.append("status",newStatus);
        //     formData.append("title", info.row.original.title);
        //     formData.append("slug", info.row.original.slug);
        //     formData.append("id", info.row.original.id);
        //     formData.append("content",info.row.original. content);
        //     formData.append("icon",info.row.original. icon);
        //     formData.append("metaTitle",info.row.original. metaTitle);
        //     formData.append("metaDescription",info.row.original. metaDescription);
        //     formData.append("tags",info.row.original. tags);
        //     formData.append("tags",info.row.original. tags);





        //     formData.append("authorId", 11); // Replace with dynamic author ID if applicable

        //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/service`, formData, {
        //       headers: { "Content-Type": "multipart/form-data" },
        //     });

        //     // Access response data directly, no need to call response.json()
        //     const result = response.data;

        //     if (result.success) {
        //       // Update local data to reflect the status change
        //       setData((prevData) =>
        //         prevData.map((item) =>
        //           item.id === info.row.original.id
        //             ? { ...item, status: newStatus }
        //             : item
        //         )
        //       );

        //     } else {
        //       alert('Error updating status');
        //     }
        //   } catch (error) {
        //     console.error('Error toggling status:', error);
        //   } finally{
        //     window.location.reload();

        //   }
        // };


        return (
          <div className="flex items-center space-x-2">
            {/* <span className={`text-sm font-medium ${status === 'Published' ? 'text-green-600' : 'text-gray-600'}`}>
              {status}
            </span> */}
            <button
              // onClick={}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              {status === 'published' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        );
      },
    }),
    columnHelper.accessor("publishedAt", {
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => column.toggleSorting()}>
          Created At
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
          {/* <Link href={`/admin/service/details?slug=${info.getValue()}`}>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </Link> */}
          <Link href={`/admin/service/addEdit?id=${info.getValue()}`}>
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
    data: Array.isArray(data) ? data : [],
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


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maincategory?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Service deleted successfully!");
          // Update the local state to remove the deleted item from the table
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          const errorData = await response.json();
          console.error("Error deleting service:", errorData);
          alert("Failed to delete the service. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        window.location.reload();
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maincategory`);
        const result = await response.json();
        if (result?.services) {
          setData(result.services);
        } else {
          setData([]); // Fallback if no services key is present
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setData([]); // Fallback in case of error
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-card">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Services</h2>
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
            <Link href={`/admin/service/addEdit`}>
              <button className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
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
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table?.getRowModel()?.rows && table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </button>
            <button
              className="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTable;
