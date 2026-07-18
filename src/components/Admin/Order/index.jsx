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
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Loader from "../common/Loader";

const OrderTable = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0); // Total count from API
  const [pageIndex, setPageIndex] = useState(0);      // Current page index (0-based)
  const [pageSize, setPageSize] = useState(10);         // Orders per page

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("user.name", {
      header: "User Name",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("user.email", {
      header: "Email",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("user.phone", {
      header: "Phone",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <div className="text-green-500 font-semibold">
          ₹{parseFloat(info.getValue()).toFixed(2)}
        </div>
      ),
    }),
    columnHelper.accessor("paymentGateway", {
      header: "Gateway",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("paymentStatus", {
      header: "Payment Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${info.getValue() === "success"
            ? "bg-green-100 text-green-700"
            : info.getValue() === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {new Date(info.getValue()).toLocaleString()}
        </div>
      ),
    }),
    columnHelper.accessor("orderItems", {
      header: "Items",
      cell: (info) => (
        <div className="text-sm text-gray-800">
          {info.getValue().map((item, index) => (
            <div key={index} className="border-b py-1">
              <div className="font-medium">{item.productName}</div>
              <div className="text-xs text-gray-500">
                Qty: {item.quantity} | ₹{item.totalAmount}
              </div>
            </div>
          ))}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      setPageIndex((old) =>
        typeof updater === "function" ? updater(old) : updater
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Because our API handles pagination
    pageCount: Math.ceil(totalOrders / pageSize),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass pagination parameters to your API endpoint if supported
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${pageIndex + 1}&limit=${pageSize}`
        );
        const result = await response.json();
        setData(result.orders || []);
        setTotalOrders(result.totalOrders || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIndex, pageSize]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Display Total Orders and Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <strong>Total Orders:</strong> {totalOrders}
          </div>
          <div className="relative">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 py-2 px-4 text-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Order Table */}
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          {/* Optional: Table Footer for pagination summary */}
          {/* <tfoot>
            <tr>
              <td colSpan={columns.length} className="px-6 py-3 text-right text-gray-700">
                Page {pageIndex + 1} of {Math.ceil(totalOrders / pageSize)}
              </td>
            </tr>
          </tfoot> */}
        </table>
      </div>

      {/* Pagination Controls */}
      {/* <div className="flex justify-end items-center mt-4 gap-4">
        <button
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPageIndex((old) => (old + 1 < Math.ceil(totalOrders / pageSize) ? old + 1 : old))}
          disabled={pageIndex + 1 >= Math.ceil(totalOrders / pageSize)}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div> */}
    </div>
  );
};

export default OrderTable;
