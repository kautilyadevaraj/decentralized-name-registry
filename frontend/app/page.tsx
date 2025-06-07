"use client"

import Link from "next/link"
import { Search, ArrowRight, Sparkles, Shield } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NameSearchForm } from "@/components/name-search-form"
import { HeroAnimation } from "@/components/hero-animation"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-28 bg-gradient-to-b from-background to-background via-purple/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your <span className="gradient-text">Digital Identity</span>{" "}
                    in the Decentralized World
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Secure your unique name on the blockchain. Simple,
                    permanent, and truly yours.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <NameSearchForm />
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-purple px-8 text-sm font-medium text-primary-foreground shadow transition-all duration-300 hover:bg-purple-dark hover:shadow-md hover:shadow-purple/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pb-28 bg-gradient-to-b from-background via-amber/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    <span className="gradient-text">How It Works</span>
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our decentralized naming registry provides a simple way to
                    claim and manage your digital identity.
                  </p>
                </div>
                <ul className="grid gap-6">
                  <motion.li
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple to-teal text-primary-foreground">
                      <Search className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Search for a name</h3>
                      <p className="text-sm text-muted-foreground">
                        Check if your desired name is available using our search
                        tool.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-teal to-cyan text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Register your name</h3>
                      <p className="text-sm text-muted-foreground">
                        If available, register the name to make it permanently
                        yours on the blockchain.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber to-pink text-primary-foreground">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Manage your profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Access your profile to view and manage all your
                        registered names.
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-lg border bg-background p-8 shadow-lg glow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold gradient-text">
                        Try it now
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Search for a name to see if it&apos;s available for
                        registration.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-purple transition-colors duration-300" />
                        <Input
                          type="search"
                          placeholder="Search for a name..."
                          className="w-full pl-8 transition-all duration-300 border-muted group-hover:border-purple/50"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 hover:shadow-md hover:shadow-purple/20 group"
                      >
                        Search
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">
                        Popular searches:{" "}
                      </span>
                      <Link
                        href="/search?name=crypto.dcn"
                        className="text-purple hover:underline mx-1"
                      >
                        crypto.dcn
                      </Link>
                      <Link
                        href="/search?name=blockchain.dcn"
                        className="text-teal hover:underline mx-1"
                      >
                        blockchain.dcn
                      </Link>
                      <Link
                        href="/search?name=satoshi.dcn"
                        className="text-amber hover:underline mx-1"
                      >
                        satoshi.dcn
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0 bg-gradient-to-t from-background to-background via-purple/5">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025{" "}
            <span className="gradient-text font-medium">BlockRegistry</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-purple hover:underline transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-teal hover:underline transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-amber hover:underline transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
      <Link href="/register" className="floating-action-button">
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple/20"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Register Name
        </Button>
      </Link>
    </div>
  );
}
