"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { getNameRegistryContract } from "@/lib/contract";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nameParam = searchParams.get("name");

  const [name, setName] = useState(nameParam || "");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationYears, setRegistrationYears] = useState(1);

  useEffect(() => {
    if (nameParam) {
      checkNameAvailability(nameParam);
    }
  }, [nameParam]);

  const checkNameAvailability = async (name: string) => {
    setIsLoading(true);

    try {
      const contract = await getNameRegistryContract(); // ← now async
      if (!contract) throw new Error("Contract not found");

      const available: boolean = await contract.isAvailable(name);
      setIsAvailable(available);
    } catch (error: any) {
      console.error("Error checking availability:", error.message || error);
      setIsAvailable(null);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/register?name=${encodeURIComponent(name.trim())}`);
    }
  };

  const handleRegister = async () => {
    if (!name) return;

    setIsRegistering(true);
    setIsSuccess(false);

    try {
      const contract = await getNameRegistryContract();
      if (!contract) throw new Error("Contract not found");

      const totalFee = ethers.utils.parseEther(
        (0.01 * registrationYears).toString()
      );

      const tx = await contract.register(name, registrationYears, {
        value: totalFee,
      });

      console.log("⏳ Waiting for transaction confirmation...");
      await tx.wait();

      setIsSuccess(true);
      console.log("✅ Registration successful!");

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(
        "❌ Registration failed:",
        err.reason || err.message || err
      );
      alert(`Registration failed: ${err.reason || err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold gradient-text">Register a Name</h1>
          <p className="text-muted-foreground">
            Secure your unique identity in the decentralized world
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
                  Registration Successful
                </CardTitle>
                <CardDescription>
                  Your name has been successfully registered in the
                  decentralized naming registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-green-500/10 border-green-500/20">
                  <AlertTitle className="text-green-500">
                    Registration Complete
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      <strong className="gradient-text">{name}</strong> has been
                      registered for {registrationYears}{" "}
                      {registrationYears === 1 ? "year" : "years"}.
                    </p>
                    <p>
                      You can now use this name as your digital identity across
                      the decentralized web.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
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
        ) : (
          <Card className="w-full border border-muted/80 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="gradient-text">Register a name</CardTitle>
              <CardDescription>
                Enter a name to register in our decentralized registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="e.g., yourname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pr-12 transition-all duration-300 border-muted focus:border-purple/50 focus:ring-2 focus:ring-purple/20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      .dcn
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking
                    </>
                  ) : (
                    "Check Availability"
                  )}
                </Button>
              </form>

              {nameParam && !isLoading && (
                <div className="mt-6 space-y-6">
                  {isAvailable ? (
                    <>
                      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Name Available</AlertTitle>
                        <AlertDescription>
                          {nameParam} is available for registration
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label
                              htmlFor="years"
                              className="flex items-center"
                            >
                              <Clock className="mr-2 h-4 w-4 text-purple" />
                              Registration Period: {registrationYears}{" "}
                              {registrationYears === 1 ? "year" : "years"}
                            </Label>
                            <span className="text-sm text-muted-foreground">
                              {registrationYears}{" "}
                              {registrationYears === 1 ? "year" : "years"}
                            </span>
                          </div>
                          <Slider
                            id="years"
                            min={1}
                            max={10}
                            step={1}
                            value={[registrationYears]}
                            onValueChange={(value) =>
                              setRegistrationYears(value[0])
                            }
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 year</span>
                            <span>5 years</span>
                            <span>10 years</span>
                          </div>
                        </div>

                        <motion.div
                          className="rounded-md p-4 glow"
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
                            <span>Registration fee</span>
                            <span>0.01 ETH/year</span>
                          </div>
                          <div className="flex justify-between mb-4 font-medium">
                            <span>
                              Total ({registrationYears}{" "}
                              {registrationYears === 1 ? "year" : "years"})
                            </span>
                            <span className="gradient-text text-lg">
                              {(0.01 * registrationYears).toFixed(2)} ETH
                            </span>
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20 group"
                            onClick={handleRegister}
                            disabled={isRegistering}
                          >
                            {isRegistering ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                                Register Name
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <Alert
                      variant="destructive"
                      className="bg-destructive/10 border-destructive/20"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Name Unavailable</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">
                          {nameParam} is already registered.
                        </p>
                        <Link
                          href={`/name/${encodeURIComponent(nameParam || "")}`}
                          className="text-purple hover:underline flex items-center"
                        >
                          View name details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
