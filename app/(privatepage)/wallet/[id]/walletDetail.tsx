"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletDetails {
  address_id: string;
  address_label: string;
  currency: string;
  network_name: string;
  wallet_address: string;
  account_id: string;
  is_whitelist: number;
  update_time: string;
}

export default function DashboardPage({ data }: { data: string }) {
  const [filteredWallet, setFilteredWallet] = useState<WalletDetails | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const storedDetails = localStorage.getItem("walletDetails");
    if (storedDetails) {
      const walletDetails = JSON.parse(storedDetails);
      const matchingWallet = walletDetails.find(
        (wallet) => wallet.address_id === data
      );
      setFilteredWallet(matchingWallet);
    }
  }, [data]);

  function formatToMalaysiaTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (!filteredWallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <Card className="max-w-lg w-full shadow-xl rounded-lg bg-white border border-gray-200">
          <CardHeader className="p-6 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Loading Wallet Details...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-3/4 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-1/2 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-2/3 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-1/4 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-full rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-2/3 rounded-md bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 w-1/2 rounded-md bg-gray-200 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 border border-gray-200 mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Wallet Details
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="text-sm">
              <tr className="bg-blue-500 text-white font-medium">
                <th className="px-4 py-2 text-left border border-gray-300">
                  Title
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Label
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.address_label}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Currency
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.currency}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Network
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.network_name}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Wallet Address
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.wallet_address}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Account ID
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.account_id}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Address ID
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.address_id}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Is Whitelist
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {filteredWallet.is_whitelist === 1 ? "True" : "False"}
                </td>
              </tr>
              <tr className="group hover:bg-blue-50 transition duration-200">
                <td className="px-4 py-3 border border-gray-300 text-gray-600">
                  Update Time (GMT+8)
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-800">
                  {formatToMalaysiaTime(filteredWallet.update_time)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="py-2 px-6 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
