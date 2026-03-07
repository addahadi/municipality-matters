-- Seed Data for Municipal Property Management System
-- Passwords are bcrypt hashed version of 'password123'

INSERT INTO users (id, username, national_id, password, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'admin', '1000000001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zQvz0JqY1mPpC0d3/r6V2', 'ADMIN'),
  ('a2000000-0000-0000-0000-000000000002', 'employee1', '2000000001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zQvz0JqY1mPpC0d3/r6V2', 'EMPLOYEE'),
  ('a3000000-0000-0000-0000-000000000003', 'citizen1', '3000000001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zQvz0JqY1mPpC0d3/r6V2', 'CITIZEN'),
  ('a4000000-0000-0000-0000-000000000004', 'citizen2', '3000000002', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zQvz0JqY1mPpC0d3/r6V2', 'CITIZEN');

INSERT INTO properties (id, title, superficie, status, location, starting_auction_price, cahier_price) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Municipal Office Block A', 500.00, 'AVAILABLE', 'Downtown District', 5000000.00, 2000.00),
  ('b2000000-0000-0000-0000-000000000002', 'Commercial Space B12', 120.00, 'RENTED', 'Market Street', NULL, 1500.00),
  ('b3000000-0000-0000-0000-000000000003', 'Residential Plot C7', 300.00, 'AUCTION', 'North Zone', 2000000.00, 1000.00);

INSERT INTO auctions (id, property_id, start_date, end_date, status, starting_price) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b3000000-0000-0000-0000-000000000003', NOW(), NOW() + INTERVAL '30 days', 'OPEN', 2000000.00);

INSERT INTO bids (auction_id, citizen_id, amount) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 2100000.00),
  ('c1000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000004', 2200000.00);

INSERT INTO invoices (citizen_id, total, amount_paid, remaining_amount, status) VALUES
  ('a3000000-0000-0000-0000-000000000003', 2000.00, 0, 2000.00, 'UNPAID'),
  ('a3000000-0000-0000-0000-000000000003', 1500.00, 500.00, 1000.00, 'PARTIAL');

INSERT INTO requests (citizen_id, type, description) VALUES
  ('a3000000-0000-0000-0000-000000000003', 'PROPERTY_INFO', 'Requesting details about property Block A');

INSERT INTO complaints (citizen_id, description) VALUES
  ('a4000000-0000-0000-0000-000000000004', 'Road near property C7 is damaged');

INSERT INTO reviews (citizen_id, content) VALUES
  ('a3000000-0000-0000-0000-000000000003', 'Great service at the municipal office');

INSERT INTO announcements (title, content, language) VALUES
  ('New Properties Available', 'Several new municipal properties are now available for rent.', 'EN'),
  ('عقارات جديدة متوفرة', 'عدة عقارات بلدية جديدة متاحة الآن للإيجار.', 'AR');

INSERT INTO messages (sender_id, receiver_id, content) VALUES
  ('a2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Property inspection for Block A completed.');
