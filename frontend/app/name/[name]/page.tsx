"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Copy,
  Check,
  AlertCircle,
  Clock,
  Shield,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ethers } from "ethers";
import { getNameRegistryContract } from "@/lib/contract";
import {CustomLoader} from "@/components/CustomLoader";

type NameDetails = {
  name: string;
  owner: string;
  registrationDate: string;
  expiryDate: string;
  isOwner: boolean;
};

export default function NameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const nameParam = params.name as string;

  const [nameDetails, setNameDetails] = useState<NameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!nameParam) {
        router.push("/");
        return;
      }

      try {
        const contract = await getNameRegistryContract();
        if (!contract) throw new Error("Contract not found");

        const [owner, regDate, expiry] = await Promise.all([
          contract.getOwner(nameParam),
          contract.getRegistrationDate(nameParam),
          contract.getExpiry(nameParam),
        ]);

        // If the owner is the zero address, treat this as unregistered
        if (owner === "0x0000000000000000000000000000000000000000") {
          setNameDetails(null);
        } else {
          const provider = new ethers.providers.Web3Provider(
            (window as any).ethereum
          );
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const myAddress = await signer.getAddress();

          const isOwner = owner.toLowerCase() === myAddress.toLowerCase();
          const registrationDate = new Date(Number(regDate.toString()) * 1000);
          const expiryDate = new Date(Number(expiry.toString()) * 1000);

          setNameDetails({
            name: nameParam,
            owner,
            registrationDate: registrationDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            isOwner,
          });
        }
      } catch (err: any) {
        console.error("Failed to load name data:", err.message || err);
        setNameDetails(null);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [nameParam]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <CustomLoader message="Name Details"/>
  }

  if (!nameDetails) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 gradient-text">{nameParam}</h1>
          <p className="text-muted-foreground mb-8">Name Details</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Name Not Registered</AlertTitle>
              <AlertDescription>
                <p className="mb-4">
                  This name is not currently registered in our system.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300"
                >
                  <Link
                    href={`/register?name=${encodeURIComponent(nameParam)}`}
                  >
                    Register this name
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(nameDetails.expiryDate);
  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry < 30;

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          {nameDetails.name}
        </h1>
        <p className="text-muted-foreground mb-8">Name Details</p>

        <Card className="border border-muted/80 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="space-y-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                <span className="text-muted-foreground">Owner</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm">
                    {nameDetails.owner.substring(0, 7)}...
                    {nameDetails.owner.substring(nameDetails.owner.length - 5)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-purple/10 hover:text-purple transition-colors"
                    onClick={() => copyToClipboard(nameDetails.owner)}
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                <span className="text-muted-foreground">Registration Date</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 text-purple" />
                  {new Date(nameDetails.registrationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                <span className="text-muted-foreground">Expiry Date</span>
                <span
                  className={`flex items-center ${
                    isExpired
                      ? "text-destructive"
                      : isExpiringSoon
                      ? "text-amber"
                      : "text-teal"
                  }`}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(nameDetails.expiryDate).toLocaleDateString()}
                  {isExpired && (
                    <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                      Expired
                    </span>
                  )}
                  {isExpiringSoon && (
                    <span className="ml-2 text-xs bg-amber/10 text-amber px-2 py-0.5 rounded-full">
                      Expiring Soon
                    </span>
                  )}
                </span>
              </div>
            </div>

            {nameDetails.isOwner ? (
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300">
                  <Link
                    href={`/renew/${nameDetails.name}`}
                    className="flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renew Name
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-purple/20 hover:bg-purple/10 hover:text-purple transition-colors"
                >
                  <Link
                    href={`/transfer/${nameDetails.name}`}
                    className="flex items-center"
                  >
                    Transfer Name
                  </Link>
                </Button>
              </div>
            ) : (
              <Alert className="mt-4 bg-amber/10 border-amber/20">
                <Shield className="h-10 w-10" />
                <AlertTitle>Name Already Registered</AlertTitle>
                <AlertDescription>
                  This name is already registered by another user.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
