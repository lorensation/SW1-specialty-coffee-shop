import { Link, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Feed', path: '/feed' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Info', path: '/info' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Coffee className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-coffee bg-clip-text text-transparent">
              Royal Coffee
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button variant="ghost" className="transition-smooth hover:text-accent">
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="transition-smooth hover:text-accent"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className="transition-smooth hover:text-accent"
                >
                  <User className="h-5 w-5" />
                </Button>
                {profile?.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="hidden md:flex"
                  >
                    Admin
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden md:flex"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  {link.name}
                </Button>
              </Link>
            ))}
            {user ? (
              profile?.role === 'admin' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  Admin Dashboard
                </Button>
              )
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
