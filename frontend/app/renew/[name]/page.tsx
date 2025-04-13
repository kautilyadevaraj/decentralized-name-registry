"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowLeft,
  RefreshCw,
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
import { Slider } from "@/components/ui/slider";
import { getNameRegistryContract } from "@/lib/contract";

type NameDetails = {
  name: string;
  owner: string;
  registrationDate: string;
  expiryDate: string;
  isOwner: boolean;
};

export default function RenewNamePage() {
  const params = useParams();
  const router = useRouter();
  const nameParam = params.name as string;

  const [nameDetails, setNameDetails] = useState<NameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [renewalYears, setRenewalYears] = useState(1);
  const [error, setError] = useState<string | null>(null);

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
            setError("You are not the owner of this name and cannot renew it.");
          }
        }
      } catch (err: any) {
        console.error("Failed to load name data:", err.message || err);
        setNameDetails(null);
        setError("Failed to load name data. Please try again.");
      }

      setLoading(false);
    };

    fetchDetails();
  }, [nameParam]);

  const handleRenew = async () => {
    if (!nameDetails || !nameDetails.isOwner) return;

    setIsRenewing(true);
    setError(null);

    try {
      const contract = await getNameRegistryContract();
      if (!contract) throw new Error("Contract not found");

      // Calculate renewal fee (0.01 ETH per year)
      const renewalFee = ethers.utils.parseEther(
        (0.01 * renewalYears).toString()
      );

      // Call the renew function on the contract
      const tx = await contract.renew(nameParam, renewalYears, {
        value: renewalFee,
      });

      console.log("Waiting for transaction confirmation...");
      await tx.wait();

      setIsSuccess(true);
      console.log("Renewal successful!");

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error("Renewal failed:", err.reason || err.message || err);
      setError(
        `Renewal failed: ${err.reason || err.message || "Unknown error"}`
      );
    } finally {
      setIsRenewing(false);
    }
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color based on days until expiry
  const getExpiryStatusColor = (days: number) => {
    if (days < 0) return "text-destructive";
    if (days < 30) return "text-amber";
    return "text-teal";
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-2 text-center">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <Card className="w-full border border-muted/80 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!nameDetails) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold gradient-text">Renew Name</h1>
            <p className="text-muted-foreground">
              Extend the registration period for your name
            </p>
          </div>

          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/20"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Name Not Found</AlertTitle>
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

  const daysUntilExpiry = getDaysUntilExpiry(nameDetails.expiryDate);
  const expiryStatusColor = getExpiryStatusColor(daysUntilExpiry);
  const isExpired = daysUntilExpiry < 0;

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold gradient-text">Renew Name</h1>
          <p className="text-muted-foreground">
            Extend the registration period for your name
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
                  Renewal Successful
                </CardTitle>
                <CardDescription>
                  Your name has been successfully renewed in the decentralized
                  naming registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-green-500/10 border-green-500/20">
                  <AlertTitle className="text-green-500">
                    Renewal Complete
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      <strong className="gradient-text">
                        {nameDetails.name}
                      </strong>{" "}
                      has been renewed for {renewalYears}{" "}
                      {renewalYears === 1 ? "year" : "years"}.
                    </p>
                    <p>
                      The new expiry date is{" "}
                      {new Date(
                        new Date(nameDetails.expiryDate).getTime() +
                          renewalYears * 365 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                      .
                    </p>
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
                  <Link href={`/name/${nameDetails.name}`}>
                    View Name Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <Card className="w-full border border-muted/80 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="gradient-text">
                {nameDetails.name}
              </CardTitle>
              <CardDescription>
                Renew this name to extend its registration period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-muted transition-colors">
                  <span className="text-muted-foreground">
                    Current Expiry Date
                  </span>
                  <span className={`flex items-center ${expiryStatusColor}`}>
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(nameDetails.expiryDate).toLocaleDateString()}
                    {isExpired && (
                      <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                        Expired
                      </span>
                    )}
                    {!isExpired && daysUntilExpiry < 30 && (
                      <span className="ml-2 text-xs bg-amber/10 text-amber px-2 py-0.5 rounded-full">
                        Expiring Soon
                      </span>
                    )}
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
                    <div className="flex justify-between">
                      <label htmlFor="years" className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 text-purple" />
                        Renewal Period: {renewalYears}{" "}
                        {renewalYears === 1 ? "year" : "years"}
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {renewalYears} {renewalYears === 1 ? "year" : "years"}
                      </span>
                    </div>
                    <Slider
                      id="years"
                      min={1}
                      max={10}
                      step={1}
                      value={[renewalYears]}
                      onValueChange={(value) => setRenewalYears(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 year</span>
                      <span>5 years</span>
                      <span>10 years</span>
                    </div>
                  </div>

                  <motion.div
                    className="rounded-xl p-4 glow"
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
                    <div className="flex justify-between mb-2">
                      <span>Renewal fee</span>
                      <span>0.01 ETH/year</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>
                        Total ({renewalYears}{" "}
                        {renewalYears === 1 ? "year" : "years"})
                      </span>
                      <span className="gradient-text text-lg">
                        {(0.01 * renewalYears).toFixed(2)} ETH
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span>New Expiry Date</span>
                      <span className="text-teal">
                        {new Date(
                          new Date(nameDetails.expiryDate).getTime() +
                            renewalYears * 365 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20 group"
                      onClick={handleRenew}
                      disabled={isRenewing}
                    >
                      {isRenewing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Renewal...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                          Renew Name
                        </>
                      )}
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
