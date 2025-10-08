import { Coffee, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">Royal Coffee</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium single-origin coffee roasted to perfection.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-accent transition-smooth">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-muted-foreground hover:text-accent transition-smooth">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/feed" className="text-muted-foreground hover:text-accent transition-smooth">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-muted-foreground hover:text-accent transition-smooth">
                  Info & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Coffee Street</li>
              <li>Brewtown, CA 94102</li>
              <li>info@royalcoffee.com</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Monday - Friday: 7am - 7pm</li>
              <li>Saturday: 8am - 8pm</li>
              <li>Sunday: 8am - 6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Royal Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
