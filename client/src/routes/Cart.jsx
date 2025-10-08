import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuantityPicker from '@/components/QuantityPicker';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (index, newQuantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    addToast('Item removed from cart', 'success');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
    addToast('Cart cleared', 'success');
  };

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.unit_price_cents * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Cart is empty', 'error');
      return;
    }

    try {
      // Create fake order
      const orderData = {
        user_id: user?.id || null,
        status: 'submitted',
        total_cents: calculateTotal(),
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        size: item.size,
        qty: item.quantity,
        unit_price_cents: item.unit_price_cents,
        line_total_cents: item.unit_price_cents * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();
      
      addToast('Order placed successfully! (This is a demo - no payment processed)', 'success');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Checkout error:', error);
      addToast('Error placing order. Please try again.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some delicious coffee to get started!
          </p>
          <Button onClick={() => navigate('/menu')} size="lg">
            Browse Menu
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200'}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Size: {item.size}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <QuantityPicker
                          value={item.quantity}
                          onChange={(newQty) => updateQuantity(index, newQty)}
                        />
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            ${(item.unit_price_cents / 100).toFixed(2)} each
                          </p>
                          <p className="font-bold text-lg">
                            ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                
                <div className="space-y-2 py-4 border-y">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">
                    ${(calculateTotal() / 100).toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full transition-smooth hover:scale-105"
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  * This is a demo. No actual payment will be processed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
