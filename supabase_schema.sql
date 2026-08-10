-- ==========================================
-- SUPER SECURE SUPABASE SCHEMA
-- ==========================================

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add block status, permissions, and phone to profiles safely
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Admin Check Function (Used in policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
-- Users can read their own profile, Admins can read all profiles.
DROP POLICY IF EXISTS "Users can read own profile or admins can read all" ON profiles;
CREATE POLICY "Users can read own profile or admins can read all" ON profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile (except role), Admins can update any.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (
       -- If admin, allow any change. If user, ensure they don't change their role to 'admin'
       public.is_admin() OR role = 'user'
    );

-- Only admins can delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE USING (public.is_admin());


-- 2. Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'), new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Laptops Table
CREATE TABLE IF NOT EXISTS laptops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    original_price NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    ram TEXT NOT NULL,
    storage TEXT NOT NULL,
    cpu TEXT NOT NULL,
    gpu TEXT,
    screen TEXT,
    battery TEXT,
    condition_outer INTEGER NOT NULL,
    condition_screen INTEGER NOT NULL,
    condition_score TEXT,
    status_badge TEXT,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    seller_note_author TEXT,
    seller_note_role TEXT,
    seller_note_avatar TEXT,
    seller_note_text TEXT,
    featured BOOLEAN DEFAULT FALSE,
    category TEXT NOT NULL,
    currency TEXT DEFAULT 'SAR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Alter table to add new fields safely if they don't exist
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 10;
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS description TEXT;

-- Enable RLS for Laptops
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;

-- Laptops Policies
-- Public Read Access
DROP POLICY IF EXISTS "Allow public read access to laptops" ON laptops;
CREATE POLICY "Allow public read access to laptops" ON laptops
    FOR SELECT USING (true);

-- Admin Write Access
DROP POLICY IF EXISTS "Allow admin write access to laptops" ON laptops;
CREATE POLICY "Allow admin write access to laptops" ON laptops
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending_approval', 'awaiting_payment', 'payment_review', 'confirmed', 'preparing', 'on_way', 'delivered', 'rejected')),
    rejection_reason TEXT,
    payment_method TEXT NOT NULL,
    driver_name TEXT,
    arrival_time TEXT,
    driver_phone TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Safely add the user_id column if the table already existed from before
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);


-- Enable RLS for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own orders ONLY.
DROP POLICY IF EXISTS "Allow public insert access to orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated insert access to orders" ON orders;
CREATE POLICY "Allow authenticated insert access to orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own orders, Admins can read all orders
DROP POLICY IF EXISTS "Allow users to read own orders and admins all" ON orders;
CREATE POLICY "Allow users to read own orders and admins all" ON orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Only Admins can update orders
DROP POLICY IF EXISTS "Allow admins to update orders" ON orders;
CREATE POLICY "Allow admins to update orders" ON orders
    FOR UPDATE USING (public.is_admin());

-- Enable Realtime for orders safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END
$$;

-- Secure Order Calculation Trigger (Anti-Tampering)
CREATE OR REPLACE FUNCTION public.secure_order_calculation()
RETURNS trigger AS $$
DECLARE
  calculated_subtotal NUMERIC := 0;
  item JSONB;
  real_price NUMERIC;
BEGIN
  -- Loop through each item in the incoming JSON array
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    -- Fetch the real price from laptops table securely
    SELECT price INTO real_price FROM public.laptops WHERE id = item->'laptop'->>'id';
    
    IF real_price IS NULL THEN
      RAISE EXCEPTION 'Product % not found or invalid.', item->'laptop'->>'id';
    END IF;

    -- Add to calculated subtotal
    calculated_subtotal := calculated_subtotal + (real_price * (item->>'quantity')::NUMERIC);
  END LOOP;

  -- Overwrite user-provided values with secure server-side calculations
  NEW.subtotal := calculated_subtotal;
  NEW.tax := ROUND(calculated_subtotal * 0.15);
  NEW.total := NEW.subtotal + NEW.tax;

  -- Force the user_id to be the authenticated user (extra security)
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_insert ON public.orders;
CREATE TRIGGER on_order_insert
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.secure_order_calculation();

-- Users can only read their own orders. Admins can read all.
DROP POLICY IF EXISTS "Users can read own orders, admins read all" ON orders;
CREATE POLICY "Users can read own orders, admins read all" ON orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Only admins can update or delete orders
DROP POLICY IF EXISTS "Admins can update and delete orders" ON orders;
CREATE POLICY "Admins can update and delete orders" ON orders
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
    
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
CREATE POLICY "Admins can delete orders" ON orders
    FOR DELETE USING (public.is_admin());


-- Drop the old insecure users table if it exists (Data will be lost, but it was insecure anyway)
DROP TABLE IF EXISTS public.users;

-- Index on orders user_id for high performance queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Automatic Inventory Stock Deduction Trigger
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_confirm()
RETURNS trigger AS $$
DECLARE
  item JSONB;
BEGIN
  -- Deduct inventory when order status transitions to 'confirmed' or 'preparing'
  IF (NEW.status IN ('confirmed', 'preparing')) AND (OLD.status NOT IN ('confirmed', 'preparing')) THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
      UPDATE public.laptops
      SET 
        quantity = GREATEST(0, COALESCE(quantity, 10) - (item->>'quantity')::INTEGER),
        status = CASE WHEN GREATEST(0, COALESCE(quantity, 10) - (item->>'quantity')::INTEGER) = 0 THEN 'out_of_stock' ELSE status END
      WHERE id = item->'laptop'->>'id';
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_deduct_inventory ON public.orders;
CREATE TRIGGER trg_deduct_inventory
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.deduct_inventory_on_confirm();


-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    order_id TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

DROP POLICY IF EXISTS "Users can view own notifications or admins all" ON public.notifications;
CREATE POLICY "Users can view own notifications or admins all" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users or admins can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users or admins can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());


-- 6. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view and create activity logs" ON public.activity_logs;
CREATE POLICY "Admins can view and create activity logs" ON public.activity_logs
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 7. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write access to categories" ON public.categories;
CREATE POLICY "Allow admin write access to categories" ON public.categories
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

