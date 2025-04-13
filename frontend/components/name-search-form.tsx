"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NameSearchForm() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/search?name=${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="pl-8 transition-all duration-300 border-muted focus:border-purple/50 focus:ring-2 focus:ring-purple/20"
        />
      </div>
      <Button
        type="submit"
        className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20"
      >
        Search
      </Button>
    </form>
  );
}
