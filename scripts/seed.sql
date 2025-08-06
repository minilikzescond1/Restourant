-- Seed data for restaurant app

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@restaurant.com', '$2b$10$hash_here', 'admin'),
('John Doe', 'john@example.com', '$2b$10$hash_here', 'customer'),
('Jane Smith', 'jane@example.com', '$2b$10$hash_here', 'customer');

-- Insert categories
INSERT INTO categories (name, description, image_url) VALUES 
('Appetizers', 'Start your meal with our delicious appetizers', '/images/appetizers.jpg'),
('Main Courses', 'Hearty and satisfying main dishes', '/images/mains.jpg'),
('Desserts', 'Sweet treats to end your meal', '/images/desserts.jpg'),
('Beverages', 'Refreshing drinks and beverages', '/images/beverages.jpg'),
('Salads', 'Fresh and healthy salad options', '/images/salads.jpg');

-- Insert menu items
INSERT INTO menu_items (name, description, price, category_id, preparation_time, ingredients, allergens) VALUES 
-- Appetizers
('Caesar Salad', 'Crisp romaine lettuce with parmesan cheese and croutons', 12.99, 1, 10, 'Romaine lettuce, Parmesan cheese, Croutons, Caesar dressing', 'Gluten, Dairy'),
('Buffalo Wings', 'Spicy chicken wings served with blue cheese dip', 14.99, 1, 15, 'Chicken wings, Buffalo sauce, Blue cheese', 'Dairy'),
('Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 9.99, 1, 12, 'Mozzarella cheese, Breadcrumbs, Marinara sauce', 'Gluten, Dairy'),

-- Main Courses
('Grilled Salmon', 'Fresh Atlantic salmon with lemon herb butter', 24.99, 2, 20, 'Salmon fillet, Lemon, Herbs, Butter', 'Fish, Dairy'),
('Ribeye Steak', 'Premium 12oz ribeye steak cooked to perfection', 32.99, 2, 25, 'Ribeye steak, Seasonings', 'None'),
('Chicken Parmesan', 'Breaded chicken breast with marinara and mozzarella', 19.99, 2, 22, 'Chicken breast, Marinara sauce, Mozzarella, Breadcrumbs', 'Gluten, Dairy'),
('Vegetarian Pasta', 'Penne pasta with seasonal vegetables in garlic oil', 16.99, 2, 18, 'Penne pasta, Mixed vegetables, Garlic, Olive oil', 'Gluten'),

-- Desserts
('Chocolate Cake', 'Rich chocolate layer cake with chocolate ganache', 8.99, 3, 5, 'Chocolate, Flour, Eggs, Butter', 'Gluten, Dairy, Eggs'),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.99, 3, 5, 'Mascarpone, Coffee, Ladyfingers', 'Gluten, Dairy, Eggs'),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and whipped cream', 6.99, 3, 3, 'Vanilla ice cream, Chocolate sauce, Whipped cream', 'Dairy'),

-- Beverages
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 4, 2, 'Fresh oranges', 'None'),
('Coffee', 'Premium roasted coffee', 2.99, 4, 3, 'Coffee beans', 'None'),
('Soft Drinks', 'Coca-Cola, Pepsi, Sprite, etc.', 2.49, 4, 1, 'Carbonated beverages', 'None');

-- Insert restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, location) VALUES 
(1, 2, 'Window side'),
(2, 4, 'Center'),
(3, 6, 'Private section'),
(4, 2, 'Bar area'),
(5, 4, 'Patio'),
(6, 8, 'Large dining area');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, order_type, table_number) VALUES 
(2, 45.97, 'delivered', 'dine_in', 1),
(3, 28.98, 'preparing', 'takeaway', NULL);

-- Insert order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES 
(1, 1, 1, 12.99),
(1, 4, 1, 24.99),
(1, 9, 1, 8.99),
(2, 2, 2, 14.99);
