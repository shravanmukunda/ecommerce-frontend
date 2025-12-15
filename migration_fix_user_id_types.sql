-- =====================================================
-- PRODUCTION-SAFE MIGRATION: Convert User IDs to TEXT
-- =====================================================
-- This migration converts users.id and ALL related foreign key
-- columns to TEXT to match Clerk's string-based user IDs.
--
-- Tables handled:
--   - users.id
--   - carts.user_id
--   - orders.user_id (or userID)
--   - addresses.user_id (if exists)
--
-- IMPORTANT: Run this in a transaction and test on staging first!
-- =====================================================

BEGIN;

-- Step 1: Drop ALL foreign key constraints that reference users.id
-- This prevents type mismatch errors during column type changes
ALTER TABLE carts
  DROP CONSTRAINT IF EXISTS fk_users_carts;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS fk_users_orders;

-- Drop addresses FK if it exists (check your schema)
ALTER TABLE addresses
  DROP CONSTRAINT IF EXISTS fk_addresses_users;

-- Drop any other potential FKs (add more if needed)
-- ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payments_users;
-- ALTER TABLE reviews DROP CONSTRAINT IF EXISTS fk_reviews_users;

-- Step 2: Convert users.id to TEXT first
-- Using CAST to handle existing numeric IDs (if any)
ALTER TABLE users
  ALTER COLUMN id TYPE TEXT
  USING id::TEXT;

-- Step 3: Convert all referencing columns to TEXT
-- Carts table
ALTER TABLE carts
  ALTER COLUMN user_id TYPE TEXT
  USING user_id::TEXT;

-- Orders table (handle both user_id and userID column names)
-- Check which column name your orders table uses and uncomment the correct one
ALTER TABLE orders
  ALTER COLUMN user_id TYPE TEXT
  USING user_id::TEXT;

-- If your orders table uses 'userID' instead of 'user_id', use this:
-- ALTER TABLE orders
--   ALTER COLUMN "userID" TYPE TEXT
--   USING "userID"::TEXT;

-- Addresses table (if it exists)
ALTER TABLE addresses
  ALTER COLUMN user_id TYPE TEXT
  USING user_id::TEXT;

-- Add other tables as needed
-- ALTER TABLE payments ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
-- ALTER TABLE reviews ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 4: Recreate ALL foreign key constraints
ALTER TABLE carts
  ADD CONSTRAINT fk_users_carts
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

ALTER TABLE orders
  ADD CONSTRAINT fk_users_orders
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- If using userID column name, use this instead:
-- ALTER TABLE orders
--   ADD CONSTRAINT fk_users_orders
--   FOREIGN KEY ("userID")
--   REFERENCES users(id)
--   ON DELETE CASCADE;

-- Recreate addresses FK if it exists
ALTER TABLE addresses
  ADD CONSTRAINT fk_addresses_users
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- Recreate other FKs as needed
-- ALTER TABLE payments
--   ADD CONSTRAINT fk_payments_users
--   FOREIGN KEY (user_id)
--   REFERENCES users(id)
--   ON DELETE CASCADE;

-- Step 5: Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
-- If using userID: CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders("userID");
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);  -- Usually PK already indexed

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (run after migration)
-- =====================================================

-- Check column types for all user-related columns
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE (table_name IN ('users', 'carts', 'orders', 'addresses')
  AND column_name IN ('id', 'user_id', 'userID'))
ORDER BY table_name, column_name;

-- Check ALL foreign key constraints referencing users
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'users'
ORDER BY tc.table_name, tc.constraint_name;

