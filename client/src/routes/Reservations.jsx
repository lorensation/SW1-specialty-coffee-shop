import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reservations = () => {
  const { user, profile } = useAuth();
  const { addToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || user?.email || '',
    phone: '',
    date: '',
    time_slot: '',
    party_size: '2',
  });

  const timeSlots = [
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time_slot) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      addToast('Please enter a valid phone number', 'error');
      return;
    }

    // Date validation (must be in future)
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      addToast('Please select a future date', 'error');
      return;
    }

    setLoading(true);

    try {
      const reservationData = {
        user_id: user?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        date: formData.date,
        time_slot: formData.time_slot,
        party_size: parseInt(formData.party_size),
        status: 'requested',
      };

      const { error } = await supabase
        .from('reservations')
        .insert(reservationData);

      if (error) throw error;

      addToast('Reservation request submitted successfully! We\'ll confirm shortly.', 'success');
      
      // Reset form
      setFormData({
        name: profile?.name || '',
        email: profile?.email || user?.email || '',
        phone: '',
        date: '',
        time_slot: '',
        party_size: '2',
      });
    } catch (error) {
      console.error('Reservation error:', error);
      addToast('Error submitting reservation. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Reserve a Table</h1>
            <p className="text-lg text-muted-foreground">
              Join us for an exceptional coffee experience
            </p>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>
                Please fill in your information and we'll confirm your reservation shortly
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="party-size">Party Size *</Label>
                    <Select
                      value={formData.party_size}
                      onValueChange={(value) =>
                        setFormData({ ...formData, party_size: value })
                      }
                    >
                      <SelectTrigger id="party-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} {size === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select
                    value={formData.time_slot}
                    onValueChange={(value) =>
                      setFormData({ ...formData, time_slot: value })
                    }
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full transition-smooth hover:scale-105"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Request Reservation'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Required fields. We'll confirm your reservation via email.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reservations;
