'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="flex min-h-screen">
        {/* Left Half - Auth Form */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-1/2 p-8 flex flex-col"
        >
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto">
            {children}
          </div>
        </motion.div>

        {/* Right Half - Image */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-1/2 p-8"
        >
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