-- Insert sample products for Royal Coffee
-- 2 products per category: origen, bebida, postres, ediciones

-- ORIGEN category (specialty coffee beans)
INSERT INTO products (name, description, price, category, origin, tasting_notes, image_url, stock_quantity, is_active, is_featured)
VALUES 
(
    'Ethiopian Yirgacheffe',
    'Single-origin coffee from the birthplace of coffee. Light roast with delicate floral notes.',
    18.50,
    'origen',
    'Yirgacheffe, Ethiopia',
    'Jasmine, bergamot, lemon zest, honey',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    50,
    true,
    true
),
(
    'Colombian Supremo',
    'Premium Colombian coffee with balanced sweetness and body. Medium roast perfect for any brewing method.',
    16.00,
    'origen',
    'Huila, Colombia',
    'Caramel, chocolate, nuts, citrus',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    75,
    true,
    false
);

-- BEBIDA category (coffee drinks)
INSERT INTO products (name, description, price, category, origin, tasting_notes, image_url, stock_quantity, is_active, is_featured)
VALUES 
(
    'Espresso Signature',
    'Our house blend espresso, carefully crafted with beans from Brazil and Ethiopia. Rich and balanced.',
    3.50,
    'bebida',
    NULL,
    'Dark chocolate, caramel, smooth finish',
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04',
    999,
    true,
    true
),
(
    'Cappuccino Artesanal',
    'Traditional Italian cappuccino with perfect microfoam and latte art. Made with our signature espresso blend.',
    4.50,
    'bebida',
    NULL,
    'Creamy, sweet milk, espresso balance',
    'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    999,
    true,
    false
);

-- POSTRES category (desserts)
INSERT INTO products (name, description, price, category, origin, tasting_notes, image_url, stock_quantity, is_active, is_featured)
VALUES 
(
    'Tarta de Café y Nuez',
    'Homemade coffee and walnut cake with espresso buttercream frosting. A perfect pairing with our specialty coffees.',
    5.50,
    'postres',
    NULL,
    'Coffee, walnut, butter, vanilla',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    20,
    true,
    false
),
(
    'Brownie de Chocolate Belga',
    'Rich and fudgy Belgian chocolate brownie. Best enjoyed warm with a shot of espresso on the side.',
    4.75,
    'postres',
    NULL,
    'Dark chocolate, cocoa, slight bitterness',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
    30,
    true,
    true
);

-- EDICIONES category (limited editions)
INSERT INTO products (name, description, price, category, origin, tasting_notes, image_url, stock_quantity, is_active, is_featured)
VALUES 
(
    'Geisha Panama - Edición Limitada',
    'Rare Geisha varietal from Panama. One of the most sought-after coffees in the world with complex flavor profile.',
    35.00,
    'ediciones',
    'Boquete, Panama',
    'Tropical fruit, jasmine, peach, bergamot, silky body',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
    10,
    true,
    true
),
(
    'Cold Brew Nitro - Winter Edition',
    'Limited winter edition cold brew infused with nitrogen for a creamy cascade. Smooth and refreshing.',
    6.50,
    'ediciones',
    NULL,
    'Smooth, creamy, chocolate notes, no bitterness',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    40,
    true,
    true
);
