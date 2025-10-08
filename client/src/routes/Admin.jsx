import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Calendar, Newspaper, MessageSquare, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Admin sub-pages (simplified for demo)
const AdminDashboard = () => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage coffee catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/products">
            <Button variant="outline" className="w-full">
              View Products
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>Manage table bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/reservations">
            <Button variant="outline" className="w-full">
              View Reservations
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>News</CardTitle>
          <CardDescription>Publish articles</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/news">
            <Button variant="outline" className="w-full">
              Manage News
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opinions</CardTitle>
          <CardDescription>Moderate reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/opinions">
            <Button variant="outline" className="w-full">
              Moderate Opinions
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/admin/users">
            <Button variant="outline" className="w-full">
              View Users
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminPlaceholder = ({ title }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">{title}</h2>
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          Admin interface for {title.toLowerCase()} will be implemented here.
          <br />
          This would include CRUD operations connected to Supabase.
        </p>
      </CardContent>
    </Card>
  </div>
);

const Admin = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Package },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
    { path: '/admin/news', label: 'News', icon: Newspaper },
    { path: '/admin/opinions', label: 'Opinions', icon: MessageSquare },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Management Tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminPlaceholder title="Products" />} />
              <Route path="reservations" element={<AdminPlaceholder title="Reservations" />} />
              <Route path="news" element={<AdminPlaceholder title="News" />} />
              <Route path="opinions" element={<AdminPlaceholder title="Opinions" />} />
              <Route path="users" element={<AdminPlaceholder title="Users" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
