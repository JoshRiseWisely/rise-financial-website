-- Rise Financial Partners Database Schema

-- Profiles (user application data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'advisor', 'compliance')) DEFAULT 'advisor',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Advisor Profiles (public-facing)
CREATE TABLE public.advisor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  short_bio TEXT,
  phone TEXT,
  email TEXT,
  certifications TEXT[],
  specialties TEXT[],
  profile_image_url TEXT,
  headshot_url TEXT,
  social_links JSONB DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_advisor_profiles_slug ON public.advisor_profiles(slug);
CREATE INDEX idx_advisor_profiles_user_id ON public.advisor_profiles(user_id);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Custom Pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'standard',
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')) DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  ai_generation_id UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_author ON public.pages(author_id);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_slug ON public.pages(slug);

-- Compliance Queue
CREATE TABLE public.compliance_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'page', 'advisor_profile')),
  content_id UUID NOT NULL,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_notes TEXT,
  changes_summary TEXT,
  content_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_queue_status ON public.compliance_queue(status);
CREATE INDEX idx_compliance_queue_submitted_by ON public.compliance_queue(submitted_by);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- AI Generations
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  prompt TEXT NOT NULL,
  system_context TEXT,
  model TEXT NOT NULL,
  generated_content TEXT,
  template_used TEXT,
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed', 'revision_requested', 'accepted', 'submitted_for_review')) DEFAULT 'generating',
  revision_count INT DEFAULT 0,
  revision_history JSONB DEFAULT '[]',
  tokens_used INT,
  error_message TEXT,
  resulting_page_id UUID REFERENCES public.pages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON public.ai_generations(requested_by);
CREATE INDEX idx_ai_generations_status ON public.ai_generations(status);

-- AI Usage Quotas
CREATE TABLE public.ai_usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id),
  daily_limit INT DEFAULT 20,
  monthly_limit INT DEFAULT 200,
  daily_count INT DEFAULT 0,
  monthly_count INT DEFAULT 0,
  last_reset_daily DATE DEFAULT CURRENT_DATE,
  last_reset_monthly DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
