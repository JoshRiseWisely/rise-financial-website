-- Seed Rise Financial Partners initial users
-- Run this after creating auth users in Supabase

-- Note: You must create the auth.users first in Supabase auth panel
-- Then run this to seed the profiles table with the correct UUIDs

-- Template (replace UUID placeholders):
-- INSERT INTO public.profiles (id, email, full_name, role, is_active)
-- VALUES
--   ('UUID-JOSH-HERE', 'josh@risewisely.com', 'Josh Elmore', 'admin', true),
--   ('UUID-THOMAS-HERE', 'thomas@risewisely.com', 'Thomas Hlohinec', 'advisor', true),
--   ('UUID-JEFF-HERE', 'jeff@risewisely.com', 'Jeff Speers', 'advisor', true),
--   ('UUID-JOSIAH-HERE', 'josiah@risewisely.com', 'Josiah Robison', 'compliance', true);

-- Advisor profiles (to be filled in after users exist)
-- INSERT INTO public.advisor_profiles (user_id, slug, display_name, title, short_bio, is_published)
-- VALUES
--   ('UUID-JOSH-HERE', 'josh-elmore', 'Josh Elmore', 'Founder & Lead Advisor', 'Help clients transition smoothly to retirement', false),
--   ('UUID-THOMAS-HERE', 'thomas-hlohinec', 'Thomas Hlohinec', 'Wealth Advisor', 'Expert in retirement and estate planning', false),
--   ('UUID-JEFF-HERE', 'jeff-speers', 'Jeff Speers', 'Wealth Advisor', 'Specializing in Biblical Investing', false),
--   ('UUID-JOSIAH-HERE', 'josiah-robison', 'Josiah Robison', 'Chief Compliance Officer', 'Ensuring SEC compliance and best practices', false);
