'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleThemeChange() {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  // Avoid rendering button until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className={cn('bg-muted h-8 w-8 rounded-full border', className)} />;
  }

  return (
    <button
      type="button"
      onClick={handleThemeChange}
      className={cn(
        'bg-background text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:cursor-pointer',
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      {resolvedTheme === 'light' && <MoonIcon size={16} weight="bold" />}
      {resolvedTheme === 'dark' && <SunIcon size={16} weight="bold" />}
    </button>
  );
}
