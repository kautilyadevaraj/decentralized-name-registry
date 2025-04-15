"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
  User,
  Shield,
  AlertTriangle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { ethers } from "ethers";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getNameRegistryContract } from "@/lib/contract";
import { CustomLoader } from "@/components/CustomLoader";

type NameDetails = {
  name: string;
  owner: string;
  registrationDate: string;
  expiryDate: string;
  isOwner: boolean;
};

export default function TransferNamePage() {
  const params = useParams();
  const router = useRouter();
  const nameParam = params.name as string;

  const [nameDetails, setNameDetails] = useState<NameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);

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

          if (!isOwner) {
            setError(
              "You are not the owner of this name and cannot transfer it."
            );
          }
        }
      } catch (err: any) {
        console.error("Failed to load name data:", err.message || err);
        setNameDetails(null);
        setError("Failed to load name data. Please try again.");
      }

      setTimeout(() => {
        setLoading(false);
      }, 4000);
    };

    fetchDetails();
  }, [nameParam]);

  // Validate Ethereum address
  useEffect(() => {
    try {
      if (recipientAddress && ethers.utils.isAddress(recipientAddress)) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
      }
    } catch (err) {
      setIsValidAddress(false);
    }
  }, [recipientAddress]);

  const handleTransfer = async () => {
    if (!nameDetails || !nameDetails.isOwner || !isValidAddress) return;

    setIsTransferring(true);
    setError(null);

    try {
      const contract = await getNameRegistryContract();
      if (!contract) throw new Error("Contract not found");

      // Call the transfer function on the contract
      const tx = await contract.transfer(nameParam, recipientAddress);

      console.log("⏳ Waiting for transaction confirmation...");
      await tx.wait();

      setIsSuccess(true);
      console.log("✅ Transfer successful!");

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error("❌ Transfer failed:", err.reason || err.message || err);
      setError(
        `Transfer failed: ${err.reason || err.message || "Unknown error"}`
      );
      setShowConfirmation(false);
    } finally {
      setIsTransferring(false);
    }
  };

  if (loading) {
    return <CustomLoader message="Transfer Details"/>;
  }

  if (!nameDetails) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold gradient-text">Transfer Name</h1>
            <p className="text-muted-foreground">
              Transfer ownership of your name to another address
            </p>
          </div>

          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/20"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-lg">Name Not Found</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                The name {nameParam} is not currently registered in our system.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return Home
                  </Link>
                </Button>
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
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold gradient-text">Transfer Name</h1>
          <p className="text-muted-foreground">
            Transfer ownership of your name to another address
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full border-green-500/20 glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                  Transfer Successful
                </CardTitle>
                <CardDescription>
                  Your name has been successfully transferred in the
                  decentralized naming registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-green-500/10 border-green-500/20">
                  <AlertTitle className="text-green-500 text-lg">
                    Transfer Complete
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      <strong className="gradient-text">
                        {nameDetails.name}
                      </strong>{" "}
                      has been transferred to:
                    </p>
                    <p className="font-mono text-sm bg-muted/70 p-2 rounded mb-4">
                      {recipientAddress}
                    </p>
                    <p>The new owner now has full control over this name.</p>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return Home
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20"
                >
                  <Link href="/profile">Go to Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : showConfirmation ? (
          <Card className="w-full border border-amber/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-amber flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirm Transfer
              </CardTitle>
              <CardDescription>
                Please confirm that you want to transfer ownership of this name.
                This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Alert className="bg-amber/10 border-amber/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  <p>
                    You are about to transfer{" "}
                    <strong className="gradient-text">
                      {nameDetails.name}
                    </strong>{" "}
                    to:
                  </p>
                  <p className="font-mono text-sm bg-muted/60 p-2 rounded my-2">
                    {recipientAddress}
                  </p>
                  <p>
                    After transfer, you will <strong>no longer</strong> be the
                    owner of this name and will not be able to manage it.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmation(false)}
                disabled={isTransferring}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300"
                onClick={handleTransfer}
                disabled={isTransferring}
              >
                {isTransferring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Confirm Transfer
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full border border-muted/80 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="gradient-text">
                {nameDetails.name}
              </CardTitle>
              <CardDescription>
                Transfer ownership of this name to another address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                  <span className="text-muted-foreground">Current Owner</span>
                  <span className="flex items-center">
                    <User className="mr-1 h-3 w-3 text-purple" />
                    <span className="font-mono text-sm">
                      {nameDetails.owner.substring(0, 7)}...
                      {nameDetails.owner.substring(
                        nameDetails.owner.length - 5
                      )}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="flex items-center">
                    <Shield className="mr-1 h-3 w-3 text-teal" />
                    {new Date(nameDetails.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-destructive/10 border-destructive/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {nameDetails.isOwner && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="flex items-center">
                      <Send className="mr-2 h-4 w-4 text-purple" />
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="font-mono transition-all duration-300 border-muted focus:border-purple/50 focus:ring-2 focus:ring-purple/20"
                    />
                    {recipientAddress && !isValidAddress && (
                      <p className="text-destructive text-sm mt-1">
                        Please enter a valid Ethereum address
                      </p>
                    )}
                  </div>

                  <motion.div
                    className="rounded-md p-4"
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderImage:
                        "linear-gradient(to right, #7c5cff, #14b8a6) 1",
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <div className="flex justify-between mb-4">
                      <span>Transfer Fee</span>
                      <span className="gradient-text text-lg">Free</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20 group"
                      onClick={() => setShowConfirmation(true)}
                      disabled={!isValidAddress || isTransferring}
                    >
                      <Send className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      Transfer Name
                    </Button>
                  </motion.div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/name/${nameDetails.name}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Name Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
