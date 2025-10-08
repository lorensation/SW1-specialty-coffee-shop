import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollReveal } from '@/lib/onScroll';

const Info = () => {
  const mapRef = useScrollReveal();
  const infoRef = useScrollReveal();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Visit Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the Royal Coffee difference in person
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div ref={infoRef} className="reveal space-y-6">
              <Card className="transition-smooth hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-coffee flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Location</h3>
                      <p className="text-muted-foreground">
                        123 Coffee Street<br />
                        Brewtown, CA 94102<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-coffee flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 7:00 AM - 7:00 PM</p>
                        <p>Saturday: 8:00 AM - 8:00 PM</p>
                        <p>Sunday: 8:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-coffee flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Phone</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:+15551234567" className="hover:text-accent transition-smooth">
                          (555) 123-4567
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-coffee flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:info@royalcoffee.com" className="hover:text-accent transition-smooth">
                          info@royalcoffee.com
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div ref={mapRef} className="reveal">
              <Card className="h-full overflow-hidden">
                <CardContent className="p-0 h-full min-h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.42196768468155!3d37.78583797975697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580615b7e27e7%3A0x7f1c4f3b3e3b3e3b!2sSan%20Francisco%2C%20CA%2094102!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '500px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Royal Coffee Location"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <Card className="bg-gradient-cream">
            <CardContent className="pt-6">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Getting Here</h2>
                <p className="text-muted-foreground mb-6">
                  We're conveniently located in the heart of Brewtown, just minutes from downtown. 
                  Street parking is available, and we're easily accessible by public transit on the 
                  Blue Line (Coffee Stop station).
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    🚇 Blue Line: Coffee Stop
                  </div>
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    🚌 Bus Routes: 14, 22, 38
                  </div>
                  <div className="px-4 py-2 bg-card rounded-lg border">
                    🅿️ Street Parking Available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Info;
