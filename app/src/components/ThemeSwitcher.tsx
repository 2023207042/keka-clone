import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { RNButton } from './RNButton';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    // Sync with system preference initially if not set? 
    // keeping it manual for now as per previous logic, but writing to DOM
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <RNButton 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </RNButton>
  );
}
