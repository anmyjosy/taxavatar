'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme
      ? resolvedTheme === 'light'
        ? '/10xds-tm-small2d.svg'
        : '/10xDS-logo.svg'
      : '/10xDS-logo.svg'; // fallback during SSR

  return (
    <>
      <header className="glass border-border/20 fixed top-0 right-0 left-0 z-50">
        <nav className={cn('container mx-auto', resolvedTheme === 'light' ? 'px-4' : 'px-4 py-3')}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className={cn('flex items-center gap-3', resolvedTheme === 'light' ? '-ml-4' : '')}
            >
              <div className="relative">
                <div className="bg-gradient-primary absolute inset-0 rounded-lg opacity-20 blur-lg" />
                <Image
                  src={logoSrc}
                  alt="10xds Logo"
                  className={cn(
                    'relative rounded-lg object-contain transition-all duration-300',
                    resolvedTheme === 'light'
                      ? 'h-28 w-31' // A little bigger in light mode
                      : 'h-20 w-20' // Original size for dark mode
                  )}
                  priority
                  width={200}
                  height={200}
                />
              </div>
            </div>

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
      </header>
    </>
  );
};

export default Navbar;
