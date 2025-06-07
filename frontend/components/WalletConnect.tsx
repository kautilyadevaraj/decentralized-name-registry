"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }

    try {
      // Request account access
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div>
      {account ? (
        <p className="text-sm">Connected: {account}</p>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
}
