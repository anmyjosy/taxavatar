'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import type { ThemeMode } from '@/lib/types';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, cn } from '@/lib/utils';

const THEME_SCRIPT = `
  const doc = document.documentElement;
  const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";

  if (theme === "system") {
    if (window.matchMedia("${THEME_MEDIA_QUERY}").matches) {
      doc.classList.add("dark");
    } else {
      doc.classList.add("light");
    }
  } else {
    doc.classList.add(theme);
  }
`
  .trim()
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ');

function applyTheme(theme: ThemeMode) {
  const doc = document.documentElement;

  doc.classList.remove('dark', 'light');
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'system') {
    if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
      doc.classList.add('dark');
    } else {
      doc.classList.add('light');
    }
  } else {
    doc.classList.add(theme);
  }
}

interface ThemeToggleProps {
  className?: string;
}

export function ApplyThemeScript() {
  return <script id="theme-script">{THEME_SCRIPT}</script>;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined);

  useEffect(() => {
    // Set initial theme based on localStorage or system preference
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const systemTheme = window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  function handleThemeChange() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    setTheme(newTheme);
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
      {theme === 'light' && <MoonIcon size={16} weight="bold" />}
      {theme === 'dark' && <SunIcon size={16} weight="bold" />}
    </button>
  );
}
