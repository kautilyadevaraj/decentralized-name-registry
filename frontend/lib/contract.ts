// lib/contract.ts
import { ethers } from "ethers";
import NameRegistryAbi from "@/abi/NameRegistry.json"; 

const CONTRACT_ADDRESS = "0xA161123716B1a7EB5332a88CE9910601D0AB01b0";

export const getNameRegistryContract = async (): Promise<ethers.Contract | null> => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    console.error("MetaMask is not installed");
    return null;
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, NameRegistryAbi.abi, signer);
};
