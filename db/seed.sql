-- Disable foreign key checks for setup
PRAGMA foreign_keys = OFF;

-- Drop existing tables
DROP TABLE IF EXISTS users;

-- Enable foreign key checks
PRAGMA foreign_keys = ON;

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    logto_id TEXT UNIQUE,
    created_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT 'user',
    settings TEXT
);

-- Create sample user for testing
INSERT INTO users (id, email, first_name, last_name, role, logto_id) 
VALUES (
    'wllx70hpqkji',
    'srogjegdh@gmail.com',
    'big',
    'hadj',
    'admin',
    'wllx70hpqkji'  -- Using the same id as logto_id
);