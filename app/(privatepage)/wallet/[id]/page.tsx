import type { Metadata } from "next";
import WalletDetail from "./walletDetail";

export const metadata: Metadata = {
  title: "Wallet Management Application | Wallet Detail",
};

export default async function walletPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedID = decodeURIComponent(id);

  return (
    <>
      <WalletDetail data={decodedID} />
    </>
  );
}
