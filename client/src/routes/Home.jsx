import { useNavigate } from 'react-router-dom';
import { Coffee, Award, Truck, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useScrollReveal } from '@/lib/onScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const heroRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const productsRef = useScrollReveal();

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .limit(3);
      
      if (data) setFeaturedProducts(data);
    };

    fetchFeatured();
  }, []);

  const features = [
    {
      icon: Coffee,
      title: 'Single Origin',
      description: 'Carefully sourced from the world\'s finest coffee regions',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Expertly roasted to bring out unique flavor profiles',
    },
    {
      icon: Truck,
      title: 'Fresh Delivery',
      description: 'Roasted to order and delivered at peak freshness',
    },
    {
      icon: Heart,
      title: 'Sustainably Sourced',
      description: 'Direct relationships with farmers for ethical practices',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>
        
        <div ref={heroRef} className="reveal relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground">
            Discover The Art of
            <span className="block text-accent mt-2">Premium Coffee</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Experience exceptional single-origin beans, expertly roasted to perfection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/menu')}
              className="text-lg shadow-glow transition-smooth hover:scale-105"
            >
              Explore Menu
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/reservations')}
              className="text-lg transition-smooth hover:scale-105 bg-background/10 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
            >
              Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="reveal py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Royal Coffee?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center transition-smooth hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-coffee flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="reveal py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Featured Coffees</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hand-picked selections showcasing the finest origins and roasts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/menu')}
              className="transition-smooth hover:scale-105"
            >
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-coffee text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Visit Our Café</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience our coffee in person and connect with our passionate baristas
          </p>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/info')}
            className="bg-background/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/20 transition-smooth"
          >
            Find Us
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
