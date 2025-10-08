-- Royal Coffee Database Schema
-- Creates all necessary tables with RLS policies

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  origin TEXT NOT NULL,
  notes TEXT,
  size_options JSONB DEFAULT '["12oz", "1lb"]'::jsonb,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products RLS policies
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'cart' CHECK (status IN ('cart', 'submitted', 'completed', 'cancelled')),
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders RLS policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price_cents INTEGER NOT NULL,
  line_total_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order items RLS policies
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
    )
  );

CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reservations
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Reservations RLS policies
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own reservations"
  ON public.reservations FOR UPDATE
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can delete own reservations"
  ON public.reservations FOR DELETE
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- News RLS policies
CREATE POLICY "Anyone can view published news"
  ON public.news FOR SELECT
  USING (published = true OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert news"
  ON public.news FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update news"
  ON public.news FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete news"
  ON public.news FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create opinions table
CREATE TABLE IF NOT EXISTS public.opinions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on opinions
ALTER TABLE public.opinions ENABLE ROW LEVEL SECURITY;

-- Opinions RLS policies
CREATE POLICY "Anyone can view approved opinions"
  ON public.opinions FOR SELECT
  USING (approved = true OR auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert own opinions"
  ON public.opinions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opinions"
  ON public.opinions FOR UPDATE
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can delete own opinions"
  ON public.opinions FOR DELETE
  USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Enable realtime for news and opinions
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opinions;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert seed data for products
INSERT INTO public.products (name, slug, origin, notes, price_cents, image_url, active) VALUES
('Ethiopia Yirgacheffe', 'ethiopia-yirgacheffe', 'Ethiopia', 'Bright and floral with notes of jasmine, bergamot, and blueberry. Light-medium roast showcasing the natural complexity of this renowned region.', 1899, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', true),
('Colombia Huila', 'colombia-huila', 'Colombia', 'Rich and balanced with caramel sweetness, nutty undertones, and a smooth chocolate finish. Medium roast perfect for any brewing method.', 1699, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', true),
('Kenya AA', 'kenya-aa', 'Kenya', 'Bold and wine-like with bright acidity, black currant notes, and a citrus-forward profile. Medium-dark roast for those who love complexity.', 2099, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', true),
('Guatemala Antigua', 'guatemala-antigua', 'Guatemala', 'Full-bodied with cocoa richness, subtle spice, and a smoky finish. Medium-dark roast ideal for espresso or French press.', 1799, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', true),
('Brazil Santos', 'brazil-santos', 'Brazil', 'Smooth and nutty with low acidity, chocolate undertones, and a creamy body. Medium roast perfect for everyday drinking.', 1499, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', true),
('Costa Rica Tarrazu', 'costa-rica-tarrazu', 'Costa Rica', 'Clean and bright with honey sweetness, citrus notes, and a crisp finish. Medium roast showcasing Central American excellence.', 1899, 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800', true);

-- Insert seed data for news
INSERT INTO public.news (title, body, image_url, published) VALUES
('New Ethiopian Harvest Arrives', 'We''re excited to announce the arrival of our latest Ethiopian Yirgacheffe harvest. This year''s crop showcases exceptional floral notes and a bright, clean finish that coffee lovers will adore. 

Our direct trade relationship with farmers in the Yirgacheffe region ensures not only the highest quality beans but also fair compensation and sustainable farming practices. 

Visit us this week to be among the first to experience this extraordinary coffee!', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', true),

('Sustainability Initiative Update', 'Royal Coffee is proud to share our progress on our 2025 sustainability goals. We''ve successfully transitioned to 100% compostable packaging for all our retail products and achieved carbon-neutral shipping through our partnership with local delivery services.

Additionally, we''ve established new direct trade relationships with three farming cooperatives in Colombia, Guatemala, and Kenya, ensuring fair wages and environmental stewardship throughout our supply chain.

Thank you for supporting our commitment to ethical and sustainable coffee.', 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=800', true);

-- Insert seed data for opinions
INSERT INTO public.opinions (user_id, rating, text, approved) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  5,
  'Absolutely amazing coffee! The Ethiopia Yirgacheffe has the most incredible floral notes. The staff is knowledgeable and friendly, making every visit a pleasure.',
  true
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
CREATE INDEX IF NOT EXISTS idx_opinions_user_id ON public.opinions(user_id);
CREATE INDEX IF NOT EXISTS idx_opinions_approved ON public.opinions(approved);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published);