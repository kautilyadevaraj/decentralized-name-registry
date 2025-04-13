"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FeaturedName = {
  id: string;
  name: string;
  registrationDate: string;
  isPopular: boolean;
  isNew: boolean;
  color: string;
};

export function FeaturedNames() {
  const [names, setNames] = useState<FeaturedName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNames([
        {
          id: "1",
          name: "crypto.dcn",
          registrationDate: "2025-01-15",
          isPopular: true,
          isNew: false,
          color: "purple",
        },
        {
          id: "2",
          name: "blockchain.dcn",
          registrationDate: "2025-02-20",
          isPopular: true,
          isNew: false,
          color: "teal",
        },
        {
          id: "3",
          name: "satoshi.dcn",
          registrationDate: "2025-03-10",
          isPopular: true,
          isNew: false,
          color: "amber",
        },
        {
          id: "4",
          name: "metaverse.dcn",
          registrationDate: "2025-04-01",
          isPopular: false,
          isNew: true,
          color: "pink",
        },
        {
          id: "5",
          name: "defi.dcn",
          registrationDate: "2025-03-28",
          isPopular: false,
          isNew: true,
          color: "cyan",
        },
        {
          id: "6",
          name: "nft.dcn",
          registrationDate: "2025-02-15",
          isPopular: true,
          isNew: false,
          color: "purple",
        },
        {
          id: "7",
          name: "web3.dcn",
          registrationDate: "2025-04-05",
          isPopular: false,
          isNew: true,
          color: "teal",
        },
        {
          id: "8",
          name: "dao.dcn",
          registrationDate: "2025-03-22",
          isPopular: false,
          isNew: true,
          color: "amber",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden shimmer">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-6 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {names.map((name) => (
          <motion.div key={name.id} variants={item}>
            <Link href={`/name/${name.name}`}>
              <Card
                className={`overflow-hidden card-hover border-${name.color}-light/30 relative`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-${name.color}-light`}
                />
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full bg-${name.color} mr-2`}
                    ></span>
                    {name.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    Registered on{" "}
                    {new Date(name.registrationDate).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2">
                    {name.isPopular && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-purple-light/10 text-purple hover:bg-purple-light/20 transition-colors"
                          >
                            <Star className="h-3 w-3" /> Popular
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This name is trending!</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {name.isNew && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 border-teal-light/30 text-teal hover:bg-teal-light/10 transition-colors"
                          >
                            <Zap className="h-3 w-3" /> New
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recently registered</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
