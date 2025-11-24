-- Royal Coffee - Simplified Sample Data for Development
-- Run this after schema.sql

-- =====================================================
-- SEED: Default Admin User
-- Password: Admin123! (hashed with bcrypt)
-- =====================================================
INSERT INTO users (id, email, password_hash, name, role, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@royalcoffee.com', '$2b$10$YourHashedPasswordHere', 'Administrator', 'admin', true),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'juan@example.com', '$2b$10$YourHashedPasswordHere', 'Juan Pérez', 'user', true),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'maria@example.com', '$2b$10$YourHashedPasswordHere', 'María García', 'user', true);

-- =====================================================
-- SEED: Products - Café de origen
-- =====================================================
INSERT INTO products (id, name, description, price, category, origin, tasting_notes, is_active, is_featured, stock_quantity) VALUES
('p0eebc99-1111-4ef8-bb6d-6bb9bd380a11', 'Etiopía Yirgacheffe (250g)', 'Café de alta calidad de la región de Yirgacheffe', 8.50, 'origen', 'Etiopía', 'Floral, cítrico', true, true, 50),
('p0eebc99-1112-4ef8-bb6d-6bb9bd380a12', 'Colombia Huila (250g)', 'Café suave y aromático de las montañas colombianas', 7.90, 'origen', 'Colombia', 'Caramelo, cacao', true, true, 60),
('p0eebc99-1113-4ef8-bb6d-6bb9bd380a13', 'Kenya AA (250g)', 'Café premium con cuerpo intenso', 9.90, 'origen', 'Kenya', 'Frutos rojos', true, false, 40),
('p0eebc99-1114-4ef8-bb6d-6bb9bd380a14', 'Brasil Santos (250g)', 'Café suave con notas de nuez', 6.90, 'origen', 'Brasil', 'Nuez, chocolate', true, false, 70),
('p0eebc99-1115-4ef8-bb6d-6bb9bd380a15', 'Guatemala Antigua (250g)', 'Café con acidez equilibrada', 8.20, 'origen', 'Guatemala', 'Cacao, especias', true, false, 45);

-- =====================================================
-- SEED: Products - Bebidas
-- =====================================================
INSERT INTO products (id, name, description, price, category, tasting_notes, is_active, stock_quantity) VALUES
('p0eebc99-2221-4ef8-bb6d-6bb9bd380a21', 'Cold Brew', 'Café de extracción en frío durante 12 horas', 4.00, 'bebida', '12h extracción en frío', true, 100),
('p0eebc99-2222-4ef8-bb6d-6bb9bd380a22', 'Latte', 'Doble espresso con leche vaporizada', 3.20, 'bebida', 'Doble espresso + leche', true, 100),
('p0eebc99-2223-4ef8-bb6d-6bb9bd380a23', 'Americano', 'Espresso alargado con agua caliente', 2.50, 'bebida', 'Espresso alargado', true, 100),
('p0eebc99-2224-4ef8-bb6d-6bb9bd380a24', 'Cappuccino', 'Espresso con leche y espuma', 3.50, 'bebida', 'Espresso, leche, espuma', true, 100),
('p0eebc99-2225-4ef8-bb6d-6bb9bd380a25', 'Flat White', 'Espresso con microespuma de leche', 3.80, 'bebida', 'Espresso + microespuma', true, 100);

-- =====================================================
-- SEED: Products - Postres
-- =====================================================
INSERT INTO products (id, name, description, price, category, tasting_notes, is_active, stock_quantity) VALUES
('p0eebc99-3331-4ef8-bb6d-6bb9bd380a31', 'Cheesecake', 'Tarta de queso casera con base de galleta', 5.00, 'postres', 'Casero', true, 30),
('p0eebc99-3332-4ef8-bb6d-6bb9bd380a32', 'Brownie con nueces', 'Brownie de chocolate intenso con nueces', 4.50, 'postres', 'Chocolate intenso', true, 40),
('p0eebc99-3333-4ef8-bb6d-6bb9bd380a33', 'Galletas de avena', 'Galletas artesanales de avena y pasas', 3.00, 'postres', 'Artesanal', true, 50),
('p0eebc99-3334-4ef8-bb6d-6bb9bd380a34', 'Tiramisú', 'Postre italiano con café y mascarpone', 5.50, 'postres', 'Café y mascarpone', true, 25),
('p0eebc99-3335-4ef8-bb6d-6bb9bd380a35', 'Muffin de arándanos', 'Muffin recién horneado', 3.50, 'postres', 'Recién horneado', true, 35);

-- =====================================================
-- SEED: Products - Ediciones especiales
-- =====================================================
INSERT INTO products (id, name, description, price, category, origin, tasting_notes, is_active, is_featured, stock_quantity) VALUES
('p0eebc99-4441-4ef8-bb6d-6bb9bd380a41', 'Pacamara (micro-lote)', 'Edición limitada de micro-lote exclusivo', 12.00, 'ediciones', 'El Salvador', 'Complejo, frutal', true, true, 15),
('p0eebc99-4442-4ef8-bb6d-6bb9bd380a42', 'Geisha (limitada)', 'Variedad Geisha de producción limitada', 18.00, 'ediciones', 'Panamá', 'Floral, jazmín, bergamota', true, true, 10),
('p0eebc99-4443-4ef8-bb6d-6bb9bd380a43', 'Anaeróbico experimental', 'Proceso anaeróbico experimental único', 14.00, 'ediciones', 'Costa Rica', 'Frutal, vinoso', true, true, 20);


-- =====================================================
-- SEED: Sample Reservations
-- =====================================================
INSERT INTO reservations (user_id, name, email, phone, num_people, reservation_date, reservation_time, message, status) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Juan Pérez', 'juan@example.com', '+34 600 000 001', 2, '2025-07-19', '18:00', 'Mesa junto a la ventana si es posible', 'confirmed'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Juan Pérez', 'juan@example.com', '+34 600 000 001', 3, '2025-08-20', '19:30', '', 'confirmed'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'María García', 'maria@example.com', '+34 600 000 002', 2, '2025-08-24', '20:00', 'Celebración de aniversario', 'confirmed');
