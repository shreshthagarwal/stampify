'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="flex min-h-screen">
        {/* Left Half */}
        <div className="w-1/2 p-8 flex flex-col">
          {/* Header with Logo and Auth Buttons */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold">Stampify</div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-zinc-800/50">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" className="bg-white text-zinc-900 hover:bg-zinc-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col justify-center max-w-xl"
          >
            <h1 className="text-5xl font-bold mb-6">
              Discover the World of Philately
            </h1>
            <p className="text-xl text-zinc-400 mb-8">
              Join Stampify, the premier community for stamp collectors. Share your collection, discover rare stamps, and connect with fellow philatelists.
            </p>
            <div className="flex gap-4 mb-12">
              <Link href="/signup">
                <Button size="lg" variant="default" className="bg-white text-zinc-900 hover:bg-zinc-200">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-zinc-800">
                  Learn More
                </Button>
              </Link>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full border border-zinc-800 hover:bg-zinc-800"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        {/* Right Half */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-1/2 p-8"
        >
          {/* Background Image */}
          <div className="absolute inset-0 m-6 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/assets/landing.png"
              alt="Stamp Collection"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
