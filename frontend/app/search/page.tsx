"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";

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
import { getNameRegistryContract } from "@/lib/contract";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nameParam = searchParams.get("name");

  const [name, setName] = useState(nameParam || "");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      router.push(`/search?name=${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col items-center space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Name Search</h1>
          <p className="text-muted-foreground">
            Check if your desired name is available for registration
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Search for a name</CardTitle>
            <CardDescription>
              Enter a name to check its availability in our decentralized
              registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., yourname.dcn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
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
          </CardContent>
          {nameParam && (
            <CardFooter className="flex flex-col items-start">
              <div className="w-full rounded-md border p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : isAvailable === null ? (
                  <p>Enter a name to check availability</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-1 ${
                          isAvailable
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {isAvailable ? (
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{nameParam}</p>
                        <p className="text-sm text-muted-foreground">
                          {isAvailable
                            ? "is available for registration"
                            : "is already registered"}
                        </p>
                      </div>
                    </div>

                    {isAvailable ? (
                      <Button className="w-full" asChild>
                        <Link
                          href={`/register?name=${encodeURIComponent(
                            nameParam
                          )}`}
                        >
                          Register this name
                        </Link>
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/name/${encodeURIComponent(nameParam)}`}>
                            View name details
                          </Link>
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                          Try searching for a different name
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
