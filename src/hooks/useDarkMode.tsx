
import { useEffect } from 'react';

export function useDarkMode() {
  const theme = 'dark';

  const toggleTheme = () => {
    // No-op function since we're now always using dark theme
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return { theme, toggleTheme };
}
