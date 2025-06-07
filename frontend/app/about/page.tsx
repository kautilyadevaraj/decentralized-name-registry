import { Button } from "@/components/ui/button";
import {
  Clock,
  Eye,
  Github,
  Key,
  Lock,
  MessageSquare,
  Shield,
  User,
  Wallet,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            About Decentralized Naming Registry
          </h1>
          <p className="text-muted-foreground">
            Learn about our mission to create a decentralized identity system
            for the web3 ecosystem
          </p>
        </div>

        <div className="space-y-4 bg-card/50 backdrop-blur-sm border border-muted/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold gradient-text">Our Mission</h2>
          <p className="leading-relaxed">
            The Decentralized Naming Registry (DNR) is a blockchain-based naming
            system designed to provide users with a secure, permanent, and truly
            decentralized digital identity. Our mission is to create a naming
            infrastructure that empowers individuals to own their online
            presence without relying on centralized authorities.
          </p>
          <p className="leading-relaxed">
            In the traditional web, domain names are controlled by centralized
            registrars and can be censored, seized, or manipulated. DNR changes
            this paradigm by leveraging blockchain technology to create a naming
            system that is resistant to censorship, transparent, and puts users
            in complete control of their digital identities.
          </p>
        </div>

        <div className="space-y-4 bg-card/50 backdrop-blur-sm border border-muted/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold gradient-text">How It Works</h2>
          <p className="leading-relaxed">
            DNR uses smart contracts deployed on multiple blockchains to manage
            the registration and ownership of names. When you register a name,
            you're not just renting it from a central authority—you're claiming
            true ownership of that name on the blockchain.
          </p>
          <p className="leading-relaxed">
            Each name can be linked to various records, such as cryptocurrency
            addresses, website URLs, social media profiles, and more. This
            creates a unified identity that can be used across the decentralized
            web and traditional internet.
          </p>
          <p className="leading-relaxed">The system is designed to be:</p>
          <ul className="grid gap-3 pl-6">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple/10 text-purple flex items-center justify-center mr-2 mt-0.5">
                <Shield className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-purple">Secure:</strong> Names are
                protected by the same cryptographic Names are protected by the
                same cryptographic security that safeguards blockchain
                transactions.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-teal/10 text-teal flex items-center justify-center mr-2 mt-0.5">
                <Clock className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-teal">Permanent:</strong> Once
                registered, names remain yours as long as you maintain
                ownership.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber/10 text-amber flex items-center justify-center mr-2 mt-0.5">
                <Eye className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-amber">Transparent:</strong> All
                registrations and transfers are publicly verifiable on the
                blockchain.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-cyan/10 text-cyan flex items-center justify-center mr-2 mt-0.5">
                <Lock className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-cyan">User-controlled:</strong> Only you
                have the ability to modify or transfer your names.
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-4 bg-card/50 backdrop-blur-sm border border-muted/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold gradient-text">Use Cases</h2>
          <p className="leading-relaxed">
            DNR names can be used for a variety of purposes in the decentralized
            ecosystem:
          </p>
          <ul className="grid gap-3 pl-6">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-purple/10 text-purple flex items-center justify-center mr-2 mt-0.5">
                <Wallet className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-purple">
                  Simplified cryptocurrency addresses:
                </strong>{" "}
                Replace complex wallet addresses with human-readable names.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-teal/10 text-teal flex items-center justify-center mr-2 mt-0.5">
                <Globe className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-teal">Decentralized websites:</strong>{" "}
                Point your name to IPFS or other decentralized storage to host
                censorship-resistant websites.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber/10 text-amber flex items-center justify-center mr-2 mt-0.5">
                <User className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-amber">Digital identity:</strong> Create
                a unified profile that works across dApps and services.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-cyan/10 text-cyan flex items-center justify-center mr-2 mt-0.5">
                <Key className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-cyan">Authentication:</strong> Use your
                name as a login credential for web3 applications.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-pink/10 text-pink flex items-center justify-center mr-2 mt-0.5">
                <MessageSquare className="h-3 w-3" />
              </div>
              <div>
                <strong className="text-pink">Messaging:</strong> Enable others
                to send you encrypted messages knowing only your DNR name.
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-4 bg-card/50 backdrop-blur-sm border border-muted/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold gradient-text">Our Team</h2>
          <p className="leading-relaxed">
            DNR was created by a team of blockchain developers, decentralization
            advocates, and digital identity experts who believe in a future
            where individuals have true ownership of their online presence.
          </p>
          <p className="leading-relaxed">
            The project is open-source and community-driven, with ongoing
            development focused on expanding functionality, improving user
            experience, and integrating with more blockchain networks and
            decentralized applications.
          </p>
        </div>

        <div className="space-y-4 bg-card/50 backdrop-blur-sm border border-muted/80 rounded-lg p-6">
          <h2 className="text-2xl font-bold gradient-text">Get Involved</h2>
          <p className="leading-relaxed">
            We welcome contributions from developers, designers, and anyone
            passionate about decentralized identity. Visit our GitHub repository
            to learn how you can help build the future of digital naming
            systems.
          </p>
          <p className="leading-relaxed">
            For questions, suggestions, or partnership inquiries, please contact
            us at contact@decentralizednaming.org.
          </p>
          <div className="flex justify-center mt-6">
            <Button className="bg-gradient-to-r from-purple to-teal hover:opacity-90 transition-all duration-300">
              <Link href="https://github.com/kautilyadevaraj/decentralized-name-registry" className="flex items-center">
                <Github className="mr-2 h-4 w-4" />
                Visit GitHub Repository
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
