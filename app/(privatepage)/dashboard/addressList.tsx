"use client";
import { useState, useEffect, useMemo, ReactNode } from "react";
import {
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import walletData from "../../../lib/wallet_data.json";
import Link from "next/link";
import { TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletAddress {
  abid: number;
  address_label: string;
  address_id: string;
  network: string;
}

const AddressList = () => {
  const [addresses, setAddresses] = useState<WalletAddress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    const authTokenDetail = JSON.parse(
      localStorage.getItem("authToken") as string
    );
    setAuthToken(authTokenDetail);
    fetchWalletAddresses(currentPage, itemsPerPage, authTokenDetail);
  }, [currentPage, itemsPerPage, globalFilter]);

  const fetchWalletAddresses = async (
    page: number,
    size: number,
    authTokenDetail: string = ""
  ) => {
    const bearerToken = authTokenDetail;

    const headerContent = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${bearerToken}`,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/wallet/address/list?page_num=${page}&page_size=${size}`,
        {
          method: "GET",
          headers: headerContent,
        }
      );
      const result = await response.json();

      if (result.code === 200) {
        const { total_page, item_list } = result.data;
        setAddresses(item_list);
        setTotalPages(total_page);
        localStorage.setItem("walletDetails", JSON.stringify(item_list));
        setLoading(false);
      } else {
        alert("Failed to fetch wallet addresses:");
      }
    } catch (error) {
      console.error("Failed to fetch wallet addresses:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAddress) return;

    const headerContent = {
      "x-auth-token": `Bearer ${authToken}`,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/wallet/address/book?address_id=${selectedAddress}`,
      {
        method: "DELETE",
        headers: headerContent,
      }
    );

    const res = await response.json();

    if (res.code === 200) {
      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (address) => address.address_id !== selectedAddress
        )
      );
      setShowDeletePopup(false);
      setSelectedAddress(null);

      toast({
        variant: "success",
        title: "Wallet address deleted successfully.",
      });
    }
  };
  const columns = useMemo<ColumnDef<WalletAddress>[]>(
    () => [
      {
        accessorKey: "address_label",
        header: "Address Label",
      },
      {
        accessorKey: "address_id",
        header: "Wallet Address",
        cell: ({ row }) => (
          <button className="text-blue-500 hover:underline">
            {row.original.address_id}
          </button>
        ),
      },
      {
        accessorKey: "network",
        header: "Network",
      },
    ],
    []
  );

  const table = useReactTable({
    data: addresses,
    columns,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });
  console.log("Global Filter Value:", globalFilter);
  console.log("Filtered Data:", table.getFilteredRowModel().rows);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-8 w-1/3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Loading Wallet Addresses...
            </h2>
          </div>

          <div className="flex justify-end mb-6">
            <Skeleton className="h-10 w-1/3 rounded-lg bg-gray-200 animate-pulse" />
          </div>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="table-auto w-full border-collapse">
              <tbody>
                {[...Array(3)].map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group hover:bg-blue-100 transition duration-200"
                  >
                    {[...Array(3)].map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 border border-gray-300 text-gray-700 w-1/3"
                      >
                        <Skeleton className="h-4 w-full rounded-md bg-gray-300 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm">
            <Skeleton className="h-10 w-20 rounded-lg bg-gray-200 animate-pulse" />
            <Skeleton className="h-4 w-1/3 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-10 w-20 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Wallet Addresses
        </h1>

        <div className="flex justify-end mb-6 text-sm">
          <Input
            placeholder="Search addresses..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="table-auto w-full border-collapse">
            <thead className="text-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-blue-500 text-white uppercase font-semibold"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left border border-gray-300"
                    >
                      {typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-blue-100 transition duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border border-gray-300 text-gray-700"
                    >
                      {cell.column.columnDef.accessorKey === "address_id" ? (
                        <>
                          <Link
                            href={`/wallet/${cell.row.original.address_id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {cell.renderValue() as ReactNode}
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedAddress(row.original.address_id);
                              setShowDeletePopup(true);
                            }}
                            className="float-right opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                            title="Delete Wallet"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        (cell.renderValue() as ReactNode)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Previous
          </Button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Next
          </Button>
        </div>

        <div className="flex justify-end mt-4">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {showDeletePopup && (
          <Dialog open={showDeletePopup} onOpenChange={setShowDeletePopup}>
            <DialogContent className="p-6 rounded shadow-md w-96">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p className="mb-6">
                Are you sure you want to delete this wallet address?
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setShowDeletePopup(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AddressList;
