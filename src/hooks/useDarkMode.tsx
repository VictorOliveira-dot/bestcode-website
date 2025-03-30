
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    // Remove dark mode class if it exists
    const root = window.document.documentElement;
    root.classList.remove('dark');
    
    // Ensure we're using light theme
    localStorage.setItem('theme', 'light');
  }, []);

  return { theme, toggleTheme };
}
