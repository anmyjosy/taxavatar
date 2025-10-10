'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

export const Navbar = () => {
  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="glass border-border/20 fixed top-0 right-0 left-0 z-50 border-b"
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <div className="bg-gradient-primary absolute inset-0 rounded-lg opacity-20 blur-lg" />
                <Image
                  src="/10xDS-logo.svg"
                  alt="10xds Logo"
                  width={200}
                  height={200}
                  className="relative h-20 w-20 rounded-lg object-contain"
                />
              </div>
            </motion.div>

            {/* Branding on the right */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h1 className="text-foreground text-lg font-semibold md:text-xl">Avatar AI</h1>
                <p className="text-muted-foreground -mt-1 text-[11px] md:text-xs">
                  Enterprise Intelligence
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </motion.header>
    </>
  );
};

export default Navbar;
