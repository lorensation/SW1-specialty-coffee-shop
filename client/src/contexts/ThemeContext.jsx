import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Check localStorage for guest preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sync with user profile when available
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference);
    }
  }, [profile]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Save to localStorage for guests
    if (!user) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // If user is logged in, update profile (handled in Profile component)
    // For guests, already saved to localStorage above
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
