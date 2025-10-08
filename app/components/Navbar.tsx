'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, Radio, Settings, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' },
  ];

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
                <div className="bg-gradient-primary relative flex h-10 w-10 items-center justify-center rounded-lg">
                  <Radio className="text-primary-foreground h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-foreground text-xl font-semibold">Avatar AI</h1>
                <p className="text-muted-foreground -mt-1 text-xs">Enterprise Intelligence</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              {navItems.map((item, index) => (
                <Link key={item.label} href={item.href} passHref legacyBehavior>
                  <motion.a
                    className="text-muted-foreground hover:text-foreground group relative text-sm transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                    <span className="bg-gradient-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-dark border-border/20 fixed top-0 right-0 bottom-0 z-50 w-80 border-l lg:hidden"
            >
              <div className="flex h-full flex-col p-6">
                {/* Mobile Header */}
                <div className="mb-8 flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
                      <Radio className="text-primary-foreground h-4 w-4" strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="text-foreground text-lg font-semibold">Voice AI</h1>
                      <p className="text-muted-foreground -mt-1 text-xs">Enterprise</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 space-y-1">
                  {navItems.map((item, index) => (
                    <Link key={item.label} href={item.href} passHref legacyBehavior>
                      <motion.a
                        className="text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center rounded-lg px-4 py-3 text-sm transition-all duration-200"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        onClick={() => setIsMenuOpen(false)}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.label}
                      </motion.a>
                    </Link>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="border-border/20 space-y-3 border-t pt-6">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="mr-3 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
