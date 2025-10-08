import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToastContext } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import QuantityPicker from '@/components/QuantityPicker';

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) throw error;
      
      setProduct(data);
      if (data?.size_options?.length > 0) {
        setSelectedSize(data.size_options[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      addToast('Product not found', 'error');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'error');
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingIndex = cart.findIndex(
      item => item.product_id === product.id && item.size === selectedSize
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        size: selectedSize,
        quantity,
        unit_price_cents: product.price_cents,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    addToast(`Added ${quantity}x ${product.name} to cart`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const sizeOptions = product.size_options || ['12oz', '1lb'];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/menu')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-soft">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.origin}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-accent mb-6">
                ${(product.price_cents / 100).toFixed(2)}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Tasting Notes</h3>
                <p className="text-muted-foreground">{product.notes}</p>
              </CardContent>
            </Card>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Select Size</label>
              <div className="flex gap-2">
                {sizeOptions.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className="transition-smooth"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <QuantityPicker value={quantity} onChange={setQuantity} />
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="w-full transition-smooth hover:scale-105 shadow-soft"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
