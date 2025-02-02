-- Disable foreign key checks for setup
PRAGMA foreign_keys = OFF;

-- Drop existing tables in reverse order
DROP TABLE IF EXISTS user_usage_summary;
DROP TABLE IF EXISTS usage_tracking;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS users;

-- Enable foreign key checks
PRAGMA foreign_keys = ON;

-- Base users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  logto_id TEXT UNIQUE,
  created_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'user',
  settings TEXT -- JSON string for user preferences
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
  updated_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
  last_message_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK (status IN ('active', 'archived', 'deleted')) DEFAULT 'active',
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat messages table
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at NUMERIC DEFAULT CURRENT_TIMESTAMP,
  tokens_used INTEGER DEFAULT 0,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  model TEXT DEFAULT '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
  metadata TEXT, -- JSON string for additional message data
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Usage tracking table
CREATE TABLE usage_tracking (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  timestamp NUMERIC DEFAULT CURRENT_TIMESTAMP,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  cost REAL DEFAULT 0.0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
);

-- Insert initial user
INSERT INTO users (id, email, first_name, last_name, role, logto_id) 
VALUES (
    'wllx70hpqkji',
    'srogjegdh@gmail.com',
    'big',
    'hadj',
    'admin',
    'wllx70hpqkji'
);

-- Seed data for chat sessions
INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at, last_message_at, status, message_count, total_tokens) 
VALUES 
    ('cs_01', 'wllx70hpqkji', 'AI Development Discussion', datetime('now', '-2 days'), datetime('now', '-1 hour'), datetime('now', '-1 hour'), 'active', 4, 850),
    ('cs_02', 'wllx70hpqkji', 'Project Planning', datetime('now', '-1 day'), datetime('now', '-30 minutes'), datetime('now', '-30 minutes'), 'active', 6, 1200),
    ('cs_03', 'wllx70hpqkji', 'Technical Support', datetime('now', '-12 hours'), datetime('now', '-10 minutes'), datetime('now', '-10 minutes'), 'active', 3, 600);

-- Seed data for chat messages
-- Session 1 messages
INSERT INTO chat_messages (id, session_id, user_id, role, content, created_at, tokens_used, prompt_tokens, completion_tokens, metadata) 
VALUES 
    ('msg_01', 'cs_01', 'wllx70hpqkji', 'user', 'How can we implement better AI response handling?', datetime('now', '-2 days'), 200, 150, 50, '{"isEdited": false, "reactions": []}'),
    ('msg_02', 'cs_01', 'wllx70hpqkji', 'assistant', 'We can improve AI response handling by implementing proper error handling and retry mechanisms. Would you like me to elaborate on specific strategies?', datetime('now', '-2 days', '+1 minute'), 250, 50, 200, '{"isEdited": false, "reactions": ["👍"]}');

-- Session 2 messages
INSERT INTO chat_messages (id, session_id, user_id, role, content, created_at, tokens_used, prompt_tokens, completion_tokens, metadata) 
VALUES 
    ('msg_03', 'cs_02', 'wllx70hpqkji', 'user', 'Let''s plan the next sprint goals', datetime('now', '-1 day'), 150, 100, 50, '{"isEdited": false, "reactions": []}'),
    ('msg_04', 'cs_02', 'wllx70hpqkji', 'assistant', 'Based on the current backlog, we should focus on: 1. API optimization 2. User authentication improvements 3. Performance monitoring', datetime('now', '-1 day', '+2 minutes'), 300, 50, 250, '{"isEdited": false, "reactions": ["👍", "🚀"]}');

-- Session 3 messages
INSERT INTO chat_messages (id, session_id, user_id, role, content, created_at, tokens_used, prompt_tokens, completion_tokens, metadata) 
VALUES 
    ('msg_05', 'cs_03', 'wllx70hpqkji', 'user', 'How do I optimize the database queries?', datetime('now', '-12 hours'), 180, 130, 50, '{"isEdited": false, "reactions": []}'),
    ('msg_06', 'cs_03', 'wllx70hpqkji', 'assistant', 'To optimize database queries, consider: 1) Adding proper indexes 2) Using query caching 3) Implementing connection pooling', datetime('now', '-12 hours', '+1 minute'), 220, 70, 150, '{"isEdited": false, "reactions": ["💡"]}');

-- Seed data for usage tracking
INSERT INTO usage_tracking (id, user_id, session_id, message_id, timestamp, tokens_used, prompt_tokens, completion_tokens, model, success, cost) 
VALUES 
    ('ut_01', 'wllx70hpqkji', 'cs_01', 'msg_01', datetime('now', '-2 days'), 200, 150, 50, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.002),
    ('ut_02', 'wllx70hpqkji', 'cs_01', 'msg_02', datetime('now', '-2 days', '+1 minute'), 250, 50, 200, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.0025),
    ('ut_03', 'wllx70hpqkji', 'cs_02', 'msg_03', datetime('now', '-1 day'), 150, 100, 50, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.0015),
    ('ut_04', 'wllx70hpqkji', 'cs_02', 'msg_04', datetime('now', '-1 day', '+2 minutes'), 300, 50, 250, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.003),
    ('ut_05', 'wllx70hpqkji', 'cs_03', 'msg_05', datetime('now', '-12 hours'), 180, 130, 50, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.0018),
    ('ut_06', 'wllx70hpqkji', 'cs_03', 'msg_06', datetime('now', '-12 hours', '+1 minute'), 220, 70, 150, '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', true, 0.0022);