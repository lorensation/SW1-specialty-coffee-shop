import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToastContext } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [reservations, setReservations] = useState([]);
  const [opinions, setOpinions] = useState([]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
    }
    fetchUserData();
  }, [profile]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch reservations
      const { data: reservationsData } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      setReservations(reservationsData || []);

      // Fetch opinions
      const { data: opinionsData } = await supabase
        .from('opinions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOpinions(opinionsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        name: name.trim(),
        theme_preference: theme,
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        addToast(error, 'error');
      } else {
        addToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      addToast('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      addToast('Error signing out', 'error');
    } else {
      addToast('Signed out successfully', 'success');
      navigate('/');
    }
  };

  const cancelReservation = async (id) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      addToast('Reservation cancelled', 'success');
      fetchUserData();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      addToast('Error cancelling reservation', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      requested: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="reservations">
                <Calendar className="mr-2 h-4 w-4" />
                Reservations
              </TabsTrigger>
              <TabsTrigger value="opinions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Opinions
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Theme Preference</Label>
                        <p className="text-sm text-muted-foreground">
                          Current: {theme === 'light' ? 'Light' : 'Dark'} mode
                        </p>
                      </div>
                      <Button type="button" variant="outline" onClick={toggleTheme}>
                        Toggle Theme
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <CardTitle>My Reservations</CardTitle>
                  <CardDescription>View and manage your table reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  {reservations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No reservations yet</p>
                      <Button
                        variant="link"
                        onClick={() => navigate('/reservations')}
                        className="mt-2"
                      >
                        Make a reservation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <Card key={reservation.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="font-semibold text-lg">
                                  {new Date(reservation.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.time_slot} • {reservation.party_size} guests
                                </p>
                              </div>
                              <Badge variant={getStatusBadge(reservation.status)}>
                                {reservation.status}
                              </Badge>
                            </div>
                            {reservation.status === 'requested' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelReservation(reservation.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Cancel Reservation
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opinions Tab */}
            <TabsContent value="opinions">
              <Card>
                <CardHeader>
                  <CardTitle>My Opinions</CardTitle>
                  <CardDescription>Your reviews and feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  {opinions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No opinions shared yet</p>
                      <Button
                        variant="link"
                        onClick={() => navigate('/feed')}
                        className="mt-2"
                      >
                        Share your thoughts
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {opinions.map((opinion) => (
                        <Card key={opinion.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${
                                      i < opinion.rating ? 'text-accent' : 'text-muted'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <Badge variant={opinion.approved ? 'default' : 'secondary'}>
                                {opinion.approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{opinion.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(opinion.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
