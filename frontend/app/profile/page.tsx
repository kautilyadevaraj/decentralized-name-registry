"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  ExternalLink,
  Search,
  Shield,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ethers } from "ethers";
import { getNameRegistryContract } from "@/lib/contract";
import { motion } from "framer-motion";
import { CustomLoader } from "@/components/CustomLoader";

type RegisteredName = {
  id: string;
  name: string;
  registrationDate: string;
  expiryDate: string;
};

export default function ProfilePage() {
  const [names, setNames] = useState<RegisteredName[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);


  useEffect(() => {
    const fetchNames = async () => {
      try {
        const contract = await getNameRegistryContract();
        if (!contract) throw new Error("Contract not found");

        // Request wallet connection and get the user's address
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const myAddress = await signer.getAddress();
        setWalletAddress(myAddress); 

        // Fetch all names registered by this address
        const namesArray: string[] = await contract.getNamesByOwner(myAddress);

        // For each name, fetch the registration and expiry dates from the contract
        const registeredNames: RegisteredName[] = await Promise.all(
          namesArray.map(async (name) => {
            const regTimestamp = await contract.getRegistrationDate(name);
            const expiryTimestamp = await contract.getExpiry(name);
            return {
              id: name,
              name,
              registrationDate: new Date(
                Number(regTimestamp.toString()) * 1000
              ).toISOString(),
              expiryDate: new Date(
                Number(expiryTimestamp.toString()) * 1000
              ).toISOString(),
            };
          })
        );
        setNames(registeredNames);
      } catch (err: any) {
        console.error("Error fetching registered names", err.message || err);
      }
      setLoading(false);
    };

    fetchNames();
  }, []);

  const filteredNames = names.filter((name) =>
    name.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNames = [...filteredNames].sort(
    (a, b) =>
      new Date(a.registrationDate).getTime() -
      new Date(b.registrationDate).getTime()
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your registered names and account settings
          </p>
        </div>

        <Tabs defaultValue="names" className="space-y-4">
          <TabsList className="bg-background border border-muted/80">
            <TabsTrigger
              value="names"
              className="data-[state=active]:bg-purple/10 data-[state=active]:text-purple"
            >
              My Names
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
            >
              Account Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="names" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Registered Names</h2>
              <Button
                asChild
                className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300"
              >
                <Link href="/register">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Register New Name
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your names..."
                className="pl-8 transition-all duration-300 border-muted focus:border-purple/50 focus:ring-2 focus:ring-purple/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <CustomLoader message="Profile Details"/>
            ) : sortedNames.length > 0 ? (
              <motion.div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {sortedNames.map((name) => {
                  const daysUntilExpiry = getDaysUntilExpiry(name.expiryDate);
                  const expiryStatusColor =
                    getExpiryStatusColor(daysUntilExpiry);

                  return (
                    <motion.div key={name.id} variants={item}>
                      <Card className="overflow-hidden border border-muted/80 bg-card/50 backdrop-blur-sm card-hover group relative">
                        <CardHeader className="px-4 relative z-10">
                          <CardTitle className="text-lg group-hover:gradient-text transition-all duration-300">
                            {name.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pt-0 space-y-0 relative z-10">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            Registered on{" "}
                            {new Date(
                              name.registrationDate
                            ).toLocaleDateString()}
                          </div>
                          <div
                            className={`flex items-center text-sm ${expiryStatusColor}`}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {daysUntilExpiry < 0
                              ? "Expired"
                              : `Expires in ${daysUntilExpiry} days`}
                          </div>
                        </CardContent>
                        <CardFooter className="px-4 pt-0 relative z-10">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-purple/20 hover:bg-purple/10 hover:text-purple transition-colors"
                            >
                              <Link href={`/name/${name.name}`}>
                                <ExternalLink className="mr-1 h-3 w-3" />
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-teal/20 hover:bg-teal/10 hover:text-teal transition-colors"
                            >
                              <Link href={`/renew/${name.name}`} className="flex items-center">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Renew
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="col-span-full p-8 text-center border border-dashed border-muted rounded-lg bg-muted/5">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <p className="text-muted-foreground mb-4">
                  You don't have any registered names yet.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300"
                >
                  <Link href="/register">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Register Your First Name
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="settings">
            <Card className="border border-muted/80 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="gradient-text">
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your connected wallets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Connected Wallet</h3>
                  <div className="flex items-center justify-between p-4 border rounded-md bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple to-teal flex items-center justify-center text-white">
                        <span className="text-xs font-mono">ETH</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {walletAddress
                            ? `${walletAddress.slice(
                                0,
                                7
                              )}...${walletAddress.slice(-5)}`
                            : "Not Connected"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Ethereum Sepolia Testnet
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                      Connected
                    </Badge>
                  </div>
                </div>

                
              </CardContent>
              
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
