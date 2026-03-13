-- Municipal Property Management System - PostgreSQL Schema
-- Matches UML Class Diagram exactly

-- ============ ENUMS ============

CREATE TYPE role_enum AS ENUM ('ADMIN', 'EMPLOYEE', 'CITIZEN');
CREATE TYPE property_status AS ENUM ('AVAILABLE', 'RENTED', 'AUCTION', 'CLOSED');
CREATE TYPE auction_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE invoice_status AS ENUM ('PAID', 'PARTIAL', 'UNPAID');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE complaint_status AS ENUM ('PENDING', 'RESOLVED');
CREATE TYPE review_status AS ENUM ('VISIBLE', 'HIDDEN');
CREATE TYPE language_enum AS ENUM ('EN', 'AR');

-- ============ TABLES ============

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  national_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_enum NOT NULL DEFAULT 'CITIZEN',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  cahier_de_charge_pdf VARCHAR(500),
  cahier_price DECIMAL(10,2) DEFAULT 0,
  superficie DECIMAL(10,2),
  status property_status NOT NULL DEFAULT 'AVAILABLE',
  location VARCHAR(255),
  starting_auction_price DECIMAL(12,2),
  rental_contract_pdf VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status auction_status NOT NULL DEFAULT 'OPEN',
  starting_price DECIMAL(12,2) NOT NULL,
  final_price DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  remaining_amount DECIMAL(12,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'UNPAID',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'PENDING',
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'PENDING',
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'VISIBLE',
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  language language_enum NOT NULL DEFAULT 'EN',
  date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  read_status BOOLEAN DEFAULT FALSE
);

CREATE TABLE citizen_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  document_type VARCHAR(50) NOT NULL DEFAULT 'RESIDENCE_CERTIFICATE',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cahier_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(citizen_id, property_id)
);

-- ============ INDEXES ============

CREATE INDEX idx_auctions_property ON auctions(property_id);
CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_citizen ON bids(citizen_id);
CREATE INDEX idx_invoices_citizen ON invoices(citizen_id);
CREATE INDEX idx_requests_citizen ON requests(citizen_id);
CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_reviews_citizen ON reviews(citizen_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_citizen_documents_citizen ON citizen_documents(citizen_id);
CREATE INDEX idx_cahier_purchases_citizen ON cahier_purchases(citizen_id);
CREATE INDEX idx_cahier_purchases_property ON cahier_purchases(property_id);
