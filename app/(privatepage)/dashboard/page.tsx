import type { Metadata } from "next";
import AddressList from "./addressList";

export const metadata: Metadata = {
  title: "Wallet Management Application | Dashboard",
};

export default async function dashboardPage() {
  return (
    <>
      <AddressList />
    </>
  );
}
