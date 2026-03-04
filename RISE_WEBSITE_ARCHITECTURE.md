# Rise Financial Partners — Website Architecture Document

**Prepared for:** Josh Elmore, Rise Financial Partners
**Date:** March 3, 2026
**Status:** Architecture Plan — Ready for Implementation

---

## 1. Executive Summary

Rise Financial Partners is upgrading from a static Next.js marketing site to a full-featured multi-advisor platform with role-based content management, SEC-compliant approval workflows, and an AI-powered content assistant. The architecture preserves the existing Next.js 14 / React 18 / Tailwind CSS frontend (including brand colors, typography, and component library) while adding a Supabase backend for authentication, database, and storage — all deployable on Vercel's free/hobby tier for under $50/month total. The AI Advisor Assistant uses Claude to generate pages and content blocks within pre-approved design templates, with every piece of generated content flowing through a mandatory compliance queue before going live.

---

## 2. Tech Stack Rationale

### Frontend: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS

**Why keep it:** The existing codebase is already built on this stack with a mature component library (Header, Footer, ChatWidget, HeroCardCarousel), custom Rise brand tokens (navy, gold, cream, sky), and Cormorant/Outfit font pairing. Rewriting to another framework would waste everything already built. Next.js App Router gives us server components for SEO, API routes for backend logic, and ISR (Incremental Static Regeneration) for blazing-fast page loads.

**What changes:** We add `next-auth` for authentication, `@supabase/supabase-js` for database access, and `react-quill` or `@tiptap/react` for rich-text editing in the admin panel.

### Backend: Next.js API Routes + Supabase

**Why Supabase over a separate backend:** Supabase gives us PostgreSQL, authentication, row-level security, file storage, and real-time subscriptions in one service — no separate backend server to host, pay for, or maintain. The free tier includes 500MB database, 1GB file storage, 50,000 monthly active users, and unlimited API requests. This keeps us well within Josh's $0–50/month budget while being production-grade.

**Why not a separate Express/FastAPI server:** Adding a standalone backend doubles hosting costs, doubles deployment complexity, and requires Silas to manage two separate services. Next.js API routes handle all our server-side logic (auth, CRUD, AI calls, compliance workflows) within a single deployment.

### Database: PostgreSQL (via Supabase)

**Why PostgreSQL:** Relational data with strong constraints is perfect for compliance-critical applications. We need audit trails, role-based access, content versioning, and complex queries (e.g., "show me all pending posts by advisor X in the last 30 days"). PostgreSQL's row-level security (RLS) means access control lives in the database itself, not just the API layer — a security-in-depth approach that SEC auditors appreciate.

### Authentication: Supabase Auth + NextAuth.js

**Why this combination:** Supabase Auth handles the heavy lifting (password hashing with bcrypt, JWT tokens, email verification, password reset flows). NextAuth.js provides the Next.js middleware integration (protecting routes, managing sessions). Together they give us secure auth without building anything from scratch.

**Why not OAuth/Google Sign-In:** With only 4 users, social login is overkill. Simple email + password with enforced strong passwords is appropriate. We can add OAuth later if the team grows.

### Hosting: Vercel (Free/Hobby Tier)

**Why Vercel:** The existing project is Next.js — Vercel is the native deployment platform. Zero-config deployments, automatic preview URLs for PRs, edge caching, and a generous free tier (100GB bandwidth, serverless functions). Combined with Supabase's free tier, total monthly cost is $0 for MVP and under $25 if we need to upgrade either service.

**Deployment flow:** Push to `main` → Vercel auto-deploys to production. Push to any branch → Vercel creates a preview URL for testing/review.

### Email Notifications: Resend (Free Tier)

**Why Resend:** 3,000 emails/month free, simple API, built for developers. We only need transactional emails (compliance notifications, password resets). Resend's free tier is more than sufficient for a 4-person team.

### File/Image Storage: Supabase Storage

**Why:** Already included in Supabase. Handles advisor profile images, blog featured images, and AI-generated assets. Integrated with RLS so advisors can only manage their own uploads.

### AI Content Generation: Anthropic Claude API (existing)

**Why:** Already integrated in the existing codebase with the `@anthropic-ai/sdk` package. The system prompt in `lib/system-prompt.ts` already understands Rise's brand, services, and compliance requirements. We upgrade the AI from the current Haiku-powered chat widget to a full content generation assistant using Claude Sonnet for code/content generation.

### Additional Tools & Libraries

| Tool | Purpose | Cost |
|------|---------|------|
| `@tiptap/react` | Rich-text editor for blog posts & page content | Free (open source) |
| `resend` | Transactional email (compliance notifications) | Free tier (3k/mo) |
| `zod` | Runtime schema validation for API inputs | Free |
| `date-fns` | Date formatting for audit logs & timestamps | Free |
| `next-auth` | Auth middleware for Next.js | Free |
| `@supabase/supabase-js` | Database client | Free |
| `sharp` | Image optimization for uploads | Free |

---

## 3. Database Schema

All tables live in Supabase PostgreSQL. Row-Level Security (RLS) policies enforce access at the database level.

```sql
-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

-- Supabase Auth handles the core auth table (auth.users)
-- This is our application-level user profile table

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

-- Josh Elmore = admin (master access to everything)
-- Thomas Hlohinec = advisor
-- Jeff Speers = advisor
-- Josiah Robison = compliance (also has advisor privileges for his own content)

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================
-- ADVISOR PROFILES (public-facing)
-- ============================================================

CREATE TABLE public.advisor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,              -- URL slug: /team/josh-elmore
  display_name TEXT NOT NULL,
  title TEXT,                             -- "Wealth Advisor", "Founder", etc.
  bio TEXT,                               -- Rich text (HTML from TipTap)
  short_bio TEXT,                         -- 1-2 sentence excerpt for cards
  phone TEXT,
  email TEXT,
  certifications TEXT[],                  -- ['CKA', 'CFP', etc.]
  specialties TEXT[],                     -- ['Retirement Planning', 'BRI', etc.]
  profile_image_url TEXT,
  headshot_url TEXT,
  social_links JSONB DEFAULT '{}',        -- { linkedin: "...", twitter: "..." }
  display_order INT DEFAULT 0,            -- Controls ordering on /team page
  is_published BOOLEAN DEFAULT false,     -- Must pass compliance to go live
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_advisor_profiles_slug ON public.advisor_profiles(slug);
CREATE INDEX idx_advisor_profiles_user_id ON public.advisor_profiles(user_id);

-- ============================================================
-- BLOG POSTS
-- ============================================================

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,                            -- Short summary for cards/SEO
  content TEXT NOT NULL,                   -- Rich text HTML from TipTap
  featured_image_url TEXT,
  category TEXT,                           -- 'retirement', 'investing', 'tax', 'estate', 'lifestyle'
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,               -- Set when status → published
  scheduled_for TIMESTAMPTZ,              -- Optional: future publish date
  seo_title TEXT,                         -- Override for <title> tag
  seo_description TEXT,                   -- Override for meta description
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);

-- ============================================================
-- CUSTOM PAGES (advisor-created landing pages, guides, etc.)
-- ============================================================

CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,              -- Full URL path: /estate-planning-guide
  content TEXT NOT NULL,                  -- Rich text HTML or component JSON
  template TEXT DEFAULT 'standard',       -- 'standard', 'landing', 'guide', 'case-study'
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')) DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  is_ai_generated BOOLEAN DEFAULT false,  -- Track AI-created content
  ai_generation_id UUID,                  -- Link to AI generation record
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_author ON public.pages(author_id);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_slug ON public.pages(slug);

-- ============================================================
-- COMPLIANCE QUEUE
-- ============================================================

CREATE TABLE public.compliance_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog_post', 'page', 'advisor_profile')),
  content_id UUID NOT NULL,               -- References blog_posts.id, pages.id, or advisor_profiles.id
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_notes TEXT,                    -- Feedback from compliance officer
  changes_summary TEXT,                   -- What changed (for audit purposes)
  content_snapshot JSONB,                 -- Snapshot of content at submission time
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_queue_status ON public.compliance_queue(status);
CREATE INDEX idx_compliance_queue_content ON public.compliance_queue(content_type, content_id);
CREATE INDEX idx_compliance_queue_submitted_by ON public.compliance_queue(submitted_by);
CREATE INDEX idx_compliance_queue_pending ON public.compliance_queue(submitted_at DESC) WHERE status = 'pending';

-- ============================================================
-- AUDIT LOG (SEC compliance requirement)
-- ============================================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,                   -- 'create', 'update', 'delete', 'submit_review', 'approve', 'reject', 'publish', 'login', 'ai_generate'
  resource_type TEXT NOT NULL,            -- 'blog_post', 'page', 'advisor_profile', 'compliance_queue', 'user'
  resource_id UUID,
  changes JSONB,                          -- { field: { old: "...", new: "..." } }
  metadata JSONB DEFAULT '{}',            -- Additional context (IP, user agent, etc.)
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================
-- AI GENERATION HISTORY
-- ============================================================

CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  prompt TEXT NOT NULL,                   -- What the advisor asked for
  system_context TEXT,                    -- System prompt used
  model TEXT NOT NULL,                    -- 'claude-sonnet-4-5-20250929', etc.
  generated_content TEXT,                 -- The AI output (HTML/component code)
  template_used TEXT,                     -- Which design template was applied
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed', 'revision_requested', 'accepted', 'submitted_for_review')) DEFAULT 'generating',
  revision_count INT DEFAULT 0,
  revision_history JSONB DEFAULT '[]',    -- Array of { prompt, output, timestamp }
  tokens_used INT,                        -- Track API usage per advisor
  error_message TEXT,                     -- If generation failed
  resulting_page_id UUID REFERENCES public.pages(id), -- Link to page if created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON public.ai_generations(requested_by);
CREATE INDEX idx_ai_generations_status ON public.ai_generations(status);
CREATE INDEX idx_ai_generations_created ON public.ai_generations(created_at DESC);

-- ============================================================
-- AI RATE LIMITING
-- ============================================================

CREATE TABLE public.ai_usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id),
  daily_limit INT DEFAULT 20,             -- Max generations per day
  monthly_limit INT DEFAULT 200,          -- Max generations per month
  daily_count INT DEFAULT 0,
  monthly_count INT DEFAULT 0,
  last_reset_daily DATE DEFAULT CURRENT_DATE,
  last_reset_monthly DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
);

-- ============================================================
-- TESTIMONIALS (Phase 2, but schema ready now)
-- ============================================================

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES public.profiles(id),
  client_name TEXT NOT NULL,
  client_title TEXT,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_review', 'approved', 'published')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, edit only their own (admins can edit all)
CREATE POLICY profiles_read ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blog posts: Advisors see their own; admin/compliance see all
CREATE POLICY blog_own_read ON public.blog_posts FOR SELECT USING (
  author_id = auth.uid() OR
  status = 'published' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);
CREATE POLICY blog_own_write ON public.blog_posts FOR ALL USING (
  author_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages: Same pattern as blog posts
CREATE POLICY pages_own_read ON public.pages FOR SELECT USING (
  author_id = auth.uid() OR
  status = 'published' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);
CREATE POLICY pages_own_write ON public.pages FOR ALL USING (
  author_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Compliance queue: Submitters see their own items; compliance/admin see all
CREATE POLICY compliance_read ON public.compliance_queue FOR SELECT USING (
  submitted_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

-- AI generations: Advisors see their own; admin sees all
CREATE POLICY ai_gen_read ON public.ai_generations FOR SELECT USING (
  requested_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit logs: Admin and compliance only
CREATE POLICY audit_read ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);
-- Audit logs insert is unrestricted (system writes)
CREATE POLICY audit_insert ON public.audit_logs FOR INSERT WITH CHECK (true);
```

---

## 4. API Endpoints

All endpoints are Next.js API routes under `/app/api/`. Authentication is enforced via middleware that checks the Supabase JWT on every request.

### Authentication

```
POST /api/auth/login
  - Auth: None
  - Body: { email, password }
  - Response: { user, session }
  - Notes: Creates audit log entry

POST /api/auth/logout
  - Auth: JWT required
  - Response: { success: true }

POST /api/auth/reset-password
  - Auth: None
  - Body: { email }
  - Response: { message: "Reset email sent" }
  - Notes: Sends email via Resend

POST /api/auth/update-password
  - Auth: JWT required
  - Body: { new_password }
  - Response: { success: true }
```

### User Management (Admin only)

```
GET /api/users
  - Auth: JWT required
  - Permission: Admin only
  - Response: [{ id, email, full_name, role, is_active, created_at }]

PATCH /api/users/:id
  - Auth: JWT required
  - Permission: Admin only
  - Body: { role?, is_active?, full_name? }
  - Response: { updated user }
  - Notes: Creates audit log entry
```

### Advisor Profiles

```
GET /api/advisors
  - Auth: None (public)
  - Response: [{ published advisor profiles }]
  - Notes: Returns only is_published = true for unauthenticated requests

GET /api/advisors/:slug
  - Auth: None (public)
  - Response: { full advisor profile }

PATCH /api/advisors/:slug
  - Auth: JWT required
  - Permission: Own profile OR Admin
  - Body: { bio?, title?, specialties?, social_links?, etc. }
  - Response: { updated profile }
  - Notes: If changing published fields, sets status to draft and creates compliance queue entry

POST /api/advisors/:slug/submit-review
  - Auth: JWT required
  - Permission: Own profile OR Admin
  - Response: { compliance_queue entry }
  - Notes: Sends email notification to Josiah via Resend
```

### Blog Posts

```
GET /api/blog
  - Auth: None (public — returns published only) OR JWT (returns own + published)
  - Query: ?category=&author=&page=&limit=&search=
  - Response: { posts: [...], total, page, totalPages }

GET /api/blog/:slug
  - Auth: None (public if published) OR JWT (own drafts)
  - Response: { full blog post }

POST /api/blog
  - Auth: JWT required
  - Permission: Advisor or Admin
  - Body: { title, content, excerpt, category, tags, featured_image_url, seo_title, seo_description }
  - Response: { id, status: "draft", ... }
  - Notes: Creates audit log. Auto-generates slug from title.

PATCH /api/blog/:id
  - Auth: JWT required
  - Permission: Own post OR Admin
  - Body: { title?, content?, excerpt?, category?, tags?, etc. }
  - Response: { updated post }
  - Notes: If post was approved/published, editing resets status to draft

DELETE /api/blog/:id
  - Auth: JWT required
  - Permission: Own post OR Admin
  - Response: { success: true }
  - Notes: Soft delete (sets is_deleted flag). Creates audit log.

POST /api/blog/:id/submit-review
  - Auth: JWT required
  - Permission: Own post OR Admin
  - Response: { compliance_queue entry }
  - Notes: Sets status to pending_review. Sends email to Josiah.
```

### Custom Pages

```
GET /api/pages
  - Auth: JWT required
  - Permission: Own pages OR Admin/Compliance sees all
  - Query: ?status=&template=&page=&limit=
  - Response: { pages: [...], total }

GET /api/pages/:slug
  - Auth: None (public if published) OR JWT (own drafts)
  - Response: { full page content }

POST /api/pages
  - Auth: JWT required
  - Permission: Advisor or Admin
  - Body: { title, content, template, slug, meta_title, meta_description, featured_image_url }
  - Response: { id, status: "draft", ... }

PATCH /api/pages/:id
  - Auth: JWT required
  - Permission: Own page OR Admin
  - Body: { title?, content?, template?, meta_title?, etc. }
  - Response: { updated page }

DELETE /api/pages/:id
  - Auth: JWT required
  - Permission: Own page OR Admin
  - Response: { success: true }

POST /api/pages/:id/submit-review
  - Auth: JWT required
  - Permission: Own page OR Admin
  - Response: { compliance_queue entry }
```

### Compliance Queue

```
GET /api/compliance
  - Auth: JWT required
  - Permission: Compliance or Admin
  - Query: ?status=pending&content_type=&page=&limit=
  - Response: { items: [...], total, pending_count }

GET /api/compliance/:id
  - Auth: JWT required
  - Permission: Compliance or Admin (or submitter for own items)
  - Response: { full compliance item with content snapshot and diff }

POST /api/compliance/:id/approve
  - Auth: JWT required
  - Permission: Compliance or Admin
  - Body: { notes? }
  - Response: { updated item, content now published }
  - Notes: Sets content status to approved/published. Creates audit log.

POST /api/compliance/:id/reject
  - Auth: JWT required
  - Permission: Compliance or Admin
  - Body: { notes (required) }
  - Response: { updated item, content returned to draft }
  - Notes: Sends email to submitter with rejection notes.
```

### AI Advisor Assistant

```
POST /api/ai/generate
  - Auth: JWT required
  - Permission: Advisor or Admin
  - Body: { prompt, template?: "landing" | "guide" | "case-study" | "blog" }
  - Response: SSE stream of { type: "chunk" | "complete", content, generation_id }
  - Notes: Checks rate limit first. Creates ai_generations record. Streams Claude response.

POST /api/ai/generate/:id/revise
  - Auth: JWT required
  - Permission: Own generation
  - Body: { revision_prompt }
  - Response: SSE stream with revised content
  - Notes: Increments revision_count. Appends to revision_history.

POST /api/ai/generate/:id/accept
  - Auth: JWT required
  - Permission: Own generation
  - Body: { title, slug }
  - Response: { page_id, status: "draft" }
  - Notes: Creates a new page from the AI output. Advisor can then submit for review.

GET /api/ai/history
  - Auth: JWT required
  - Permission: Own history OR Admin
  - Query: ?page=&limit=
  - Response: { generations: [...], total }

GET /api/ai/usage
  - Auth: JWT required
  - Response: { daily_count, daily_limit, monthly_count, monthly_limit }
```

### File Uploads

```
POST /api/uploads
  - Auth: JWT required
  - Body: FormData with file
  - Response: { url, filename, size }
  - Notes: Uploads to Supabase Storage. Validates file type (images only for now).
  - Max size: 5MB
```

### Audit Logs (Admin)

```
GET /api/audit-logs
  - Auth: JWT required
  - Permission: Admin or Compliance
  - Query: ?user_id=&action=&resource_type=&from=&to=&page=&limit=
  - Response: { logs: [...], total }
```

---

## 5. Compliance Workflow

### State Machine

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
                    ▼                                             │
              ┌──────────┐     Submit for     ┌──────────────┐   │
  Create ───▶ │  DRAFT   │ ───── Review ────▶ │   PENDING    │   │
              │          │                    │   REVIEW     │   │
              └──────────┘                    └──────┬───────┘   │
                    ▲                                │           │
                    │                         ┌──────┴──────┐    │
                    │                         │             │    │
                    │                    ┌────▼────┐  ┌─────▼──┐ │
                    │                    │REJECTED │  │APPROVED│ │
                    │                    │(+ notes)│  │        │ │
                    │                    └────┬────┘  └────┬───┘ │
                    │                         │           │      │
                    └── Revise & Resubmit ────┘           ▼      │
                                                   ┌──────────┐  │
                                                   │PUBLISHED │  │
                                                   │ (live)   │  │
                                                   └────┬─────┘  │
                                                        │        │
                                                        └── Edit ┘
                                                   (resets to Draft)
```

### Who Does What

| Stage | Actor | Action |
|-------|-------|--------|
| Draft | Advisor | Creates/edits content freely. No one else sees it. |
| Submit for Review | Advisor | Clicks "Submit for Review" button. Content snapshot is taken. Email sent to Josiah. |
| Pending Review | Josiah (Compliance) | Reviews content in the compliance dashboard. Sees the content and a diff from the previous version (if applicable). |
| Approved | Josiah | Clicks "Approve." Content status changes to published. Goes live immediately. Audit log entry created. |
| Rejected | Josiah | Clicks "Reject" and provides mandatory notes explaining what needs to change. Content returns to draft. Email sent to advisor with feedback. |
| Published (Edit) | Advisor | If advisor edits a published page/post, it reverts to draft. The live version stays up until the new version is approved. |

### AI-Generated Content Extra Step

```
  Advisor Prompt → AI Generates → Advisor Reviews AI Output
       │                                    │
       │                              ┌─────┴─────┐
       │                              │           │
       │                         "Revise"    "Accept"
       │                              │           │
       │                              ▼           ▼
       │                        AI Regenerates   Creates Draft Page
       │                                          │
       │                                          ▼
       └──────────────────────────── Normal Compliance Flow ─────▶
```

AI output enters the standard compliance workflow only after the advisor explicitly accepts it. This means Josiah never sees AI junk — only content the advisor has already reviewed and approved for compliance review.

---

## 6. User Permission Matrix

| Action | Admin (Josh) | Advisor (Thomas, Jeff) | Compliance (Josiah) |
|--------|:---:|:---:|:---:|
| **Content** | | | |
| Create blog posts | Yes | Yes (own) | Yes (own) |
| Edit own blog posts | Yes | Yes | Yes |
| Edit others' blog posts | Yes | No | No |
| Delete blog posts | Yes (any) | Yes (own drafts) | No |
| Create custom pages | Yes | Yes (own) | Yes (own) |
| Edit own custom pages | Yes | Yes | Yes |
| Edit others' custom pages | Yes | No | No |
| Submit content for review | Yes | Yes (own) | Yes (own) |
| View own drafts | Yes | Yes | Yes |
| View others' drafts | Yes | No | Yes (in compliance queue) |
| **Compliance** | | | |
| View compliance queue | Yes | No (only own submissions) | Yes |
| Approve content | Yes | No | Yes |
| Reject content | Yes | No | Yes |
| **Profiles** | | | |
| Edit own advisor profile | Yes | Yes | Yes |
| Edit others' advisor profiles | Yes | No | No |
| **AI Assistant** | | | |
| Use AI content generator | Yes | Yes | Yes |
| View own AI history | Yes | Yes | Yes |
| View all AI history | Yes | No | No |
| **Administration** | | | |
| Manage users (roles, active) | Yes | No | No |
| View audit logs | Yes | No | Yes |
| Edit site-wide settings | Yes | No | No |
| View all analytics | Yes | No | Yes (compliance-related) |

**Note on Josiah's dual role:** Josiah is both a compliance officer AND an advisor. He can create his own content (which another compliance-level user or Josh would need to approve — we prevent self-approval). For MVP with only one compliance officer, Josh (admin) serves as the backup approver for Josiah's content.

---

## 7. Authentication & Authorization Strategy

### Login Flow

1. Advisor navigates to `/admin/login`
2. Enters email + password
3. Frontend calls Supabase Auth `signInWithPassword()`
4. Supabase returns JWT access token + refresh token
5. NextAuth.js stores session in HTTP-only secure cookie
6. All subsequent API requests include the JWT in the Authorization header
7. Middleware validates JWT and attaches user context to the request

### Password Reset Flow

1. User clicks "Forgot Password" on login page
2. Enters their email address
3. API calls Supabase Auth `resetPasswordForEmail()`
4. Supabase sends a password reset email (via Resend SMTP integration)
5. User clicks link, lands on `/admin/reset-password?token=...`
6. User enters new password
7. API calls Supabase Auth `updateUser({ password })`

### Token Management

| Token | Storage | Lifetime | Refresh |
|-------|---------|----------|---------|
| Access Token (JWT) | HTTP-only cookie | 1 hour | Auto-refresh via Supabase |
| Refresh Token | HTTP-only cookie | 7 days | On access token expiry |
| Session | Server-side (NextAuth) | 24 hours | Rolling window |

### Where Auth Is Enforced

1. **Next.js Middleware** (`middleware.ts`): Protects all `/admin/*` routes. Redirects unauthenticated users to login.
2. **API Route Middleware**: Every `/api/*` endpoint (except `/api/auth/login` and public GETs) validates the JWT and extracts the user's role.
3. **Supabase RLS Policies**: Database-level enforcement. Even if API middleware is bypassed, the database won't return unauthorized data.
4. **Component-Level Guards**: Admin UI components check the user's role before rendering edit/delete/approve buttons.

### Initial User Setup

Since there are only 4 users, we seed them directly in Supabase during initial deployment:

```typescript
// seed-users.ts (run once during setup)
const users = [
  { email: 'josh@risewisely.com', name: 'Josh Elmore', role: 'admin' },
  { email: 'thomas@risewisely.com', name: 'Thomas Hlohinec', role: 'advisor' },
  { email: 'jeff@risewisely.com', name: 'Jeff Speers', role: 'advisor' },
  { email: 'josiah@risewisely.com', name: 'Josiah Robison', role: 'compliance' },
];
```

---

## 8. Code Organization & File Structure

### Proposed Project Structure

```
rise-financial/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public-facing pages (no auth required)
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── team/
│   │   │   ├── page.tsx              # Team listing
│   │   │   └── [slug]/page.tsx       # Individual advisor profile
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog archive with search/filter
│   │   │   └── [slug]/page.tsx       # Individual blog post
│   │   ├── community/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── [slug]/page.tsx           # Dynamic custom pages (advisor-created)
│   │   └── layout.tsx                # Public layout (Header + Footer + ChatWidget)
│   │
│   ├── admin/                        # Admin panel (auth required)
│   │   ├── layout.tsx                # Admin layout (sidebar + topbar)
│   │   ├── login/page.tsx            # Login page
│   │   ├── dashboard/page.tsx        # Overview: my content, pending items, stats
│   │   ├── profile/page.tsx          # Edit own advisor profile
│   │   ├── blog/
│   │   │   ├── page.tsx              # My blog posts list
│   │   │   ├── new/page.tsx          # Create new post (TipTap editor)
│   │   │   └── [id]/edit/page.tsx    # Edit existing post
│   │   ├── pages/
│   │   │   ├── page.tsx              # My custom pages list
│   │   │   ├── new/page.tsx          # Create new page
│   │   │   └── [id]/edit/page.tsx    # Edit existing page
│   │   ├── ai-assistant/page.tsx     # AI content generation chat
│   │   ├── compliance/               # Compliance officer views
│   │   │   ├── page.tsx              # Compliance queue
│   │   │   └── [id]/page.tsx         # Review individual item
│   │   ├── users/page.tsx            # User management (admin only)
│   │   └── audit-log/page.tsx        # Audit log viewer (admin + compliance)
│   │
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   └── update-password/route.ts
│   │   ├── users/
│   │   │   └── route.ts              # GET (list), PATCH (update)
│   │   ├── advisors/
│   │   │   ├── route.ts              # GET (list)
│   │   │   └── [slug]/
│   │   │       ├── route.ts          # GET, PATCH
│   │   │       └── submit-review/route.ts
│   │   ├── blog/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE
│   │   │       └── submit-review/route.ts
│   │   ├── pages/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE
│   │   │       └── submit-review/route.ts
│   │   ├── compliance/
│   │   │   ├── route.ts              # GET (queue list)
│   │   │   └── [id]/
│   │   │       ├── approve/route.ts
│   │   │       └── reject/route.ts
│   │   ├── ai/
│   │   │   ├── generate/route.ts     # POST (start generation)
│   │   │   ├── generate/[id]/
│   │   │   │   ├── revise/route.ts
│   │   │   │   └── accept/route.ts
│   │   │   ├── history/route.ts
│   │   │   └── usage/route.ts
│   │   ├── uploads/route.ts          # POST (file upload)
│   │   ├── audit-logs/route.ts       # GET (admin/compliance)
│   │   └── chat/route.ts             # Existing chatbot endpoint (keep as-is)
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
│
├── components/
│   ├── public/                       # Public-facing components
│   │   ├── Header.tsx                # KEEP (existing, minor updates)
│   │   ├── Footer.tsx                # KEEP (existing, minor updates)
│   │   ├── ChatWidget.tsx            # KEEP (existing)
│   │   ├── ChatMessage.tsx           # KEEP (existing)
│   │   ├── TypingIndicator.tsx       # KEEP (existing)
│   │   ├── OpenChatButton.tsx        # KEEP (existing)
│   │   ├── HeroCardCarousel.tsx      # KEEP (existing)
│   │   ├── BlogCard.tsx              # NEW
│   │   ├── AdvisorCard.tsx           # NEW
│   │   └── PageRenderer.tsx          # NEW (renders dynamic custom pages)
│   │
│   ├── admin/                        # Admin panel components
│   │   ├── AdminSidebar.tsx          # NEW
│   │   ├── AdminTopbar.tsx           # NEW
│   │   ├── RichTextEditor.tsx        # NEW (TipTap wrapper)
│   │   ├── ComplianceStatusBadge.tsx # NEW
│   │   ├── ContentTable.tsx          # NEW (reusable data table)
│   │   ├── AiChatInterface.tsx       # NEW (AI assistant chat)
│   │   ├── AiPreviewPane.tsx         # NEW (preview generated content)
│   │   ├── ComplianceReviewCard.tsx  # NEW
│   │   └── AuditLogTable.tsx         # NEW
│   │
│   └── ui/                           # Shared UI primitives
│       ├── Button.tsx                # NEW
│       ├── Input.tsx                 # NEW
│       ├── Modal.tsx                 # NEW
│       ├── Badge.tsx                 # NEW
│       ├── Toast.tsx                 # NEW
│       └── Dropdown.tsx              # NEW
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server-side Supabase client
│   │   └── admin.ts                  # Service role client (for admin ops)
│   ├── auth/
│   │   ├── middleware.ts             # Auth checking middleware
│   │   └── permissions.ts            # Role-based permission helpers
│   ├── ai/
│   │   ├── generate.ts              # Claude API integration for content gen
│   │   ├── templates.ts             # Page template definitions
│   │   ├── prompts.ts               # System prompts for each template type
│   │   └── rate-limiter.ts          # Usage quota enforcement
│   ├── compliance/
│   │   ├── workflow.ts              # State machine logic
│   │   └── notifications.ts         # Email notification triggers
│   ├── audit.ts                     # Audit log helper functions
│   ├── email.ts                     # Resend email wrapper
│   ├── system-prompt.ts             # KEEP (existing chatbot prompt)
│   └── utils.ts                     # Shared utilities (slug generation, etc.)
│
├── types/
│   ├── database.ts                  # Supabase generated types
│   ├── api.ts                       # API request/response types
│   └── auth.ts                      # Auth-related types
│
├── public/                          # Static assets
│   ├── images/                      # KEEP existing team photos & logos
│   └── favicon.ico
│
├── supabase/
│   ├── migrations/                  # Database migrations (SQL files)
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                     # Initial user data
│   └── config.toml                  # Supabase project config
│
├── middleware.ts                    # Next.js middleware (auth route protection)
├── next.config.js                  # KEEP (add Supabase image domain)
├── tailwind.config.js              # KEEP (existing Rise brand tokens)
├── tsconfig.json                   # KEEP
├── package.json                    # UPDATE (add new dependencies)
├── .env.local                      # UPDATE (add Supabase keys, Resend key)
└── .gitignore
```

### What We Keep vs. Rewrite vs. Build New

| Category | Files | Decision |
|----------|-------|----------|
| **KEEP AS-IS** | Header.tsx, Footer.tsx, ChatWidget.tsx, ChatMessage.tsx, TypingIndicator.tsx, OpenChatButton.tsx, HeroCardCarousel.tsx | Core public components work great |
| **KEEP AS-IS** | tailwind.config.js, system-prompt.ts, globals.css | Brand tokens and AI context are solid |
| **KEEP + MODIFY** | layout.tsx, page.tsx (homepage) | Add conditional admin nav, minor tweaks |
| **KEEP + MODIFY** | /team/[slug]/page.tsx | Fetch from database instead of hardcoded |
| **KEEP + MODIFY** | /api/chat/route.ts | Keep but add auth context for logged-in advisors |
| **KEEP + MODIFY** | next.config.js, package.json | Add new dependencies, image domains |
| **REWRITE** | /services/page.tsx, /contact/page.tsx | Integrate with database for dynamic content |
| **NEW** | All /admin/* pages | Full admin panel |
| **NEW** | All /api/* routes (except chat) | Backend CRUD, compliance, AI |
| **NEW** | All admin components | Dashboard, editor, compliance views |
| **NEW** | /lib/supabase/*, /lib/auth/*, /lib/ai/* | Backend logic |
| **NEW** | /supabase/migrations/* | Database schema |
| **NEW** | middleware.ts | Route protection |

---

## 9. Deployment Architecture

### Environments

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT                              │
│  Local machine: next dev + Supabase CLI (local instance)    │
│  Database: Local PostgreSQL via Supabase CLI                │
│  URL: http://localhost:3000                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │ git push to feature branch
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     STAGING (Preview)                         │
│  Vercel auto-deploys preview URL for every PR               │
│  Database: Supabase staging project (separate from prod)    │
│  URL: https://rise-financial-xyz.vercel.app                 │
│  Used for: Josiah reviews, team testing, QA                 │
└─────────────────┬───────────────────────────────────────────┘
                  │ merge PR to main
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION                               │
│  Vercel production deployment                                │
│  Database: Supabase production project                       │
│  URL: https://risewisely.com                                │
│  CDN: Vercel Edge Network (automatic)                       │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies (npm ci)
      - Run TypeScript check (tsc --noEmit)
      - Run ESLint (next lint)
      - Run unit tests (vitest)
      - Run Supabase migration check

  # Vercel handles actual deployment automatically via GitHub integration
```

### Database Migrations

Supabase migrations are SQL files in `/supabase/migrations/`. Each migration is numbered and runs in order.

```bash
# Create a new migration
supabase migration new add_testimonials_table

# Apply migrations to local
supabase db reset

# Push migrations to staging/production
supabase db push --linked
```

### Rollback Strategy

1. **Code rollback:** Vercel maintains all previous deployments. Instant rollback via Vercel dashboard (click "Promote to Production" on any previous deployment).
2. **Database rollback:** Each migration has a corresponding down migration. Run `supabase migration repair` if needed. For data issues, Supabase provides point-in-time recovery on paid plans.
3. **Emergency procedure:** If production breaks, Josh can roll back the Vercel deployment in under 60 seconds from the Vercel dashboard.

### Environment Variables

```
# .env.local (development)
# .env.staging (Vercel preview)
# .env.production (Vercel production)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend (email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=notifications@risewisely.com

# NextAuth
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=https://risewisely.com

# App
NEXT_PUBLIC_SITE_URL=https://risewisely.com
```

---

## 10. AI Advisor Assistant — Detailed Design

### UX Flow

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN PANEL — AI Assistant                              │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  Chat Interface                                      ││
│  │                                                      ││
│  │  [AI]: Hi Josh! What would you like to create?       ││
│  │                                                      ││
│  │  [You]: Create a landing page for estate planning    ││
│  │         strategies for high-net-worth families        ││
│  │                                                      ││
│  │  [AI]: I'll generate that for you using the Landing  ││
│  │         Page template. Give me a moment...            ││
│  │                                                      ││
│  │  ┌──────────────────────────────────────────┐        ││
│  │  │  PREVIEW PANE                            │        ││
│  │  │                                          │        ││
│  │  │  [Live preview of generated page]        │        ││
│  │  │                                          │        ││
│  │  │  ┌──────────┐  ┌──────────┐  ┌────────┐ │        ││
│  │  │  │ Revise   │  │ Accept   │  │ Discard│ │        ││
│  │  │  └──────────┘  └──────────┘  └────────┘ │        ││
│  │  └──────────────────────────────────────────┘        ││
│  │                                                      ││
│  │  [Type a message...                        ] [Send]  ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  Usage: 3/20 daily  •  47/200 monthly                   │
└─────────────────────────────────────────────────────────┘
```

### Available Templates

Each template is a pre-styled React component framework that the AI fills with content. This ensures brand consistency regardless of what the AI generates.

| Template | Description | Sections |
|----------|-------------|----------|
| **Landing Page** | Single-purpose conversion page | Hero, value props, CTA, testimonial slot |
| **Guide/Article** | Long-form educational content | Title, intro, sections with headings, callout boxes, CTA |
| **Case Study** | Client success story format | Challenge, approach, results, testimonial |
| **Blog Post** | Standard blog article | Title, featured image, body, author bio, tags |
| **Service Page** | Service offering detail | Overview, benefits, process, FAQ, CTA |

### Claude Prompt Engineering Strategy

The AI generation uses a layered prompt system:

```typescript
// lib/ai/prompts.ts

const BASE_SYSTEM_PROMPT = `
You are a content generator for Rise Financial Partners, a wealth management firm
in Sarasota, Florida. You generate professional, SEC-compliant financial advisory
website content.

BRAND VOICE:
- Professional but warm and approachable
- Confident without being aggressive or salesy
- Faith-informed (Biblically Responsible Investing is a key differentiator)
- Focus on partnership, stewardship, generosity, and excellence

COMPLIANCE RULES (CRITICAL):
- NEVER include specific investment returns or performance numbers
- NEVER guarantee outcomes or use language like "guaranteed", "risk-free", "sure thing"
- NEVER provide specific investment advice or recommend specific securities
- ALWAYS include appropriate disclaimers when discussing investments
- Use phrases like "may help", "designed to", "aims to" instead of definitive claims
- All content must be suitable for SEC/FINRA review

OUTPUT FORMAT:
You generate valid HTML that fits within Rise Financial's design system.
Use these Tailwind classes for consistency:
- Headings: font-display text-rise-navy
- Body text: font-body text-rise-slate
- Accents: text-rise-gold, bg-rise-cream
- CTAs: bg-rise-navy text-white hover:bg-rise-blue
`;

const TEMPLATE_PROMPTS = {
  landing: `${BASE_SYSTEM_PROMPT}
    Generate a landing page with these sections:
    1. Hero section with headline, subheadline, and CTA button
    2. 3-4 value proposition cards
    3. Detailed content section
    4. Testimonial placeholder
    5. Final CTA section
    Use the Landing Page template structure.`,

  guide: `${BASE_SYSTEM_PROMPT}
    Generate an educational guide/article...`,

  // ... etc.
};
```

### Generated Code Storage

AI-generated content is stored as HTML in the `ai_generations` table. When an advisor accepts the generation, it creates a new `pages` record with `is_ai_generated = true` and the HTML content. The content is rendered through a `PageRenderer` component that wraps the HTML in the site's standard layout.

Generated content is never written directly to the filesystem or committed to Git. It lives in the database and is rendered dynamically.

### Rate Limiting Strategy

```
Per Advisor:
  - 20 generations per day (resets at midnight)
  - 200 generations per month (resets on 1st)
  - 5 concurrent requests max

Per Generation:
  - Max 3 revisions per generation
  - Max prompt length: 2,000 characters
  - Max output tokens: 4,096

Admin (Josh) Override:
  - Can adjust any advisor's limits
  - No limits applied to admin role
```

### Error Handling

| Scenario | Handling |
|----------|----------|
| AI generates non-compliant content | Advisor sees it in preview, can revise or discard. Never goes live without compliance review. |
| AI generation fails (API error) | Show friendly error message. Log the failure. Don't count against quota. |
| AI generates broken HTML | Preview pane shows rendering errors. Advisor can revise ("fix the formatting") or discard. |
| Rate limit exceeded | Show remaining quota. Suggest trying again tomorrow. Admin can override. |
| Prompt injection attempt | Input sanitization strips code blocks, script tags, and system prompt overrides. Log suspicious attempts. |

### Security Considerations

1. **Prompt injection defense:** User prompts are wrapped in a structured template. Raw user input is placed in a clearly delimited section. The system prompt includes instructions to ignore any instructions within user content.
2. **Output sanitization:** Generated HTML is sanitized with DOMPurify before rendering. Script tags, event handlers, and iframe elements are stripped.
3. **No filesystem access:** AI-generated content never touches the filesystem or Git repo. It flows through the database only.
4. **Audit everything:** Every generation request, revision, acceptance, and submission is logged with user ID, timestamp, and full prompt/output.

---

## 11. Phase 2 & Beyond

Features not in MVP but worth planning for:

1. **Client Portal** — Secure login for Rise clients to view their documents, account summaries, and advisor communications.
2. **Appointment Booking** — Calendly or Cal.com integration for booking consultations directly from advisor profiles.
3. **Email Newsletter** — Integration with Resend or ConvertKit for advisor-authored newsletters with compliance approval.
4. **Analytics Dashboard** — Page views, blog post performance, chat engagement metrics. Consider Plausible (privacy-friendly) or PostHog.
5. **Testimonials Management** — Full CRUD for client testimonials with compliance approval workflow (schema already in place).
6. **AI Conversation Templates** — Save and share successful AI generation prompts as templates. "Josh's estate planning landing page prompt worked great — make it a template."
7. **Content Scheduling** — Approved content can be scheduled for future publication (database column already exists).
8. **Multi-Language Support** — Spanish content for the Sarasota market.
9. **SEO Toolkit** — Automated meta tag generation, sitemap.xml, structured data (FAQ, Organization, Person schemas).
10. **Form Builder** — Custom lead capture forms that advisors can embed on their pages (contact forms, guide downloads, webinar signups).

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Weeks 1–2)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 1 | Supabase project setup | Small | — | Create project, configure auth, set up storage buckets |
| 2 | Database schema & migrations | Medium | 1 | Run all CREATE TABLE statements, set up RLS policies |
| 3 | Seed initial users | Small | 2 | Create the 4 user accounts with correct roles |
| 4 | Auth integration (NextAuth + Supabase) | Medium | 1 | Login, logout, password reset, middleware protection |
| 5 | Admin layout & navigation | Medium | 4 | Sidebar, topbar, route structure, role-based menu items |

### Phase 2: Content Management (Weeks 3–4)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 6 | Rich-text editor integration | Medium | 5 | TipTap editor component with image upload support |
| 7 | Blog post CRUD | Large | 6 | Create, edit, list, delete blog posts with full API |
| 8 | Custom page CRUD | Large | 6 | Create, edit, list, delete custom pages with templates |
| 9 | Advisor profile management | Medium | 5 | Edit own profile, manage bio/specialties/social links |
| 10 | File upload system | Small | 1 | Supabase Storage integration for images |

### Phase 3: Compliance Workflow (Week 5)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 11 | Compliance queue backend | Large | 7, 8 | Submit for review, approve, reject API endpoints |
| 12 | Compliance dashboard UI | Medium | 11 | Queue view, content diff viewer, approve/reject buttons |
| 13 | Email notifications (Resend) | Medium | 11 | Notify Josiah on submission, notify advisor on rejection |
| 14 | Audit logging system | Medium | 11 | Log all admin actions with user/timestamp/changes |

### Phase 4: AI Advisor Assistant (Weeks 6–7)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 15 | AI generation API endpoint | Large | 2 | Claude integration with template prompts, streaming |
| 16 | AI chat interface | Large | 15 | Chat UI with markdown preview pane |
| 17 | Template system | Medium | 15 | Define page templates (landing, guide, case-study, etc.) |
| 18 | AI revision & accept flow | Medium | 15 | Revise, accept, create page from AI output |
| 19 | Rate limiting & quotas | Small | 15 | Daily/monthly limits per advisor |
| 20 | AI compliance integration | Medium | 11, 18 | Connect AI-accepted pages to compliance queue |

### Phase 5: Public Pages & Polish (Week 8)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 21 | Dynamic team pages | Medium | 9 | Render advisor profiles from database |
| 22 | Blog archive page | Medium | 7 | Public blog listing with search, category filter, pagination |
| 23 | Dynamic custom pages | Medium | 8 | Render advisor-created pages with SEO meta tags |
| 24 | Contact form integration | Small | 13 | Hook up contact form to actual email sending |
| 25 | SEO & performance audit | Medium | 21–24 | Meta tags, sitemap, structured data, Lighthouse optimization |

### Phase 6: QA & Launch (Week 9)

| # | Task | Size | Depends On | Description |
|---|------|------|------------|-------------|
| 26 | End-to-end testing | Large | All | Test all workflows: create, review, approve, publish |
| 27 | Security audit | Medium | All | Check auth, RLS, input validation, XSS prevention |
| 28 | DNS & domain setup | Small | 25 | Point risewisely.com to Vercel |
| 29 | Production deployment | Small | 26–28 | Final deploy, smoke tests, go live |

**Total estimated timeline: 9 weeks**

---

## 13. Open Questions / Risks

### Questions for Josh Before Implementation

1. **Domain/DNS:** You mentioned you're not sure who controls the domain. This needs to be sorted before launch. Check your domain registrar (likely GoDaddy, Namecheap, or whoever set up risewisely.com originally). We need DNS access to point the domain to Vercel.

2. **Email addresses:** Do all 4 team members have @risewisely.com email addresses? We need these for user accounts. If not, what emails should we use?

3. **Existing Wix content:** The current `next.config.js` allows images from `static.wixstatic.com`. Is there existing Wix content that needs to be migrated? Or can we ignore this?

4. **Blog content:** Do you have existing blog posts or articles that need to be imported into the new system?

5. **Compliance sign-off:** Does Josiah need to review and approve this architecture before implementation begins? Especially the AI content generation feature — are there SEC/FINRA implications for auto-generating advisor content that Josiah should weigh in on?

6. **Self-approval prevention:** When Josiah creates his own content, who approves it? Currently Josh (admin) would be the backup approver. Is this acceptable?

7. **Content templates:** For the AI-generated pages, do you have specific visual mockups or examples of landing pages you love? This will help define the template designs.

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Domain access unknown** | High | Must resolve before launch. Can develop and test on Vercel preview URLs in the meantime. |
| **AI generates non-compliant content** | Medium | Multi-layer defense: compliance-aware system prompt, advisor review step, mandatory compliance approval. Content never goes live without human review. |
| **Supabase free tier limits** | Low | 500MB database and 1GB storage is more than enough for 4 users. Upgrade path is clear ($25/mo Pro plan) if needed. |
| **Single compliance officer bottleneck** | Medium | Josh has admin approval powers as backup. Phase 2 could add a second compliance reviewer. |
| **AI API costs** | Low | Claude Sonnet at ~$3/million input tokens. Even heavy usage by 4 advisors won't exceed $20/month. |
| **SEC scrutiny of AI-generated content** | Medium | Full audit trail documents every generation. All content passes through human compliance review. Josiah should confirm this satisfies SEC requirements. |
| **Scope creep** | Medium | Strict MVP scope defined above. Phase 2 features are documented but deferred. |

---

## HANDOFF TO SILAS

**When you receive this plan, Silas will:**
1. Review the architecture for completeness and technical soundness
2. Use Claude Opus reasoning to validate decisions and flag risks
3. Break the implementation roadmap into parallel work streams for sub-agents
4. Request GitHub access (PAT token) and deployment credentials
5. Spawn sub-agents to work on:
   - Backend API development (Sonnet + Haiku) — Supabase schema, API routes, auth middleware
   - Frontend components (Sonnet + Haiku) — Admin panel pages, TipTap editor, AI chat interface
   - Database schema/migrations (Haiku) — Migration files, seed data, RLS policies
   - Compliance workflow logic (Sonnet) — State machine, email notifications, audit logging
   - AI Assistant (Sonnet) — Claude integration, template system, rate limiting, prompt engineering
   - Testing & QA (Haiku) — Unit tests, integration tests, security checks
6. Monitor all PRs, run code reviews, and post merge decisions to #silas-approvals
7. Track progress in Monday.com and report blockers in #silas-audit

**Questions for Josh before Silas starts:**
- [ ] GitHub PAT token for repo access (read + write)
- [ ] Supabase project creation (Josh creates project, shares keys with Silas)
- [ ] Resend account setup (Josh creates account, shares API key)
- [ ] Domain registrar access confirmed (who controls risewisely.com DNS?)
- [ ] Team email addresses confirmed for all 4 users
- [ ] Josiah's sign-off on AI content generation compliance implications
- [ ] Preferred deployment schedule (continuous on merge to main, or manual?)
- [ ] Who needs to sign off on PRs before merge? (Just Josh, or Josiah too?)
- [ ] Any existing content (blog posts, case studies) to migrate into the new system?
- [ ] Budget confirmation: Supabase free tier + Vercel free tier + Resend free tier + Claude API (~$20/mo) = approximately $20-30/month total. Acceptable?

**Tech Stack Summary for Silas:**
```
Frontend:     Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
Backend:      Next.js API Routes + Supabase (PostgreSQL + Auth + Storage)
AI:           Anthropic Claude API (@anthropic-ai/sdk) — Sonnet for generation
Email:        Resend (transactional notifications)
Editor:       TipTap (rich-text editing)
Hosting:      Vercel (free/hobby tier)
Database:     Supabase PostgreSQL (free tier)
Auth:         Supabase Auth + NextAuth.js
CI/CD:        GitHub Actions → Vercel auto-deploy
Validation:   Zod (runtime schema validation)
```

**Existing code to preserve:**
- All components in `/components/` (Header, Footer, ChatWidget, etc.)
- Brand tokens in `tailwind.config.js`
- System prompt in `lib/system-prompt.ts`
- Chat API route in `/api/chat/route.ts`
- All static assets in `/public/`
- Homepage (`page.tsx`) and existing page designs

**New code needed (priority order):**
1. Supabase setup + database migrations
2. Auth system (login, middleware, route protection)
3. Admin panel layout + dashboard
4. Blog post CRUD + rich-text editor
5. Custom page CRUD + template renderer
6. Compliance workflow + email notifications
7. AI Advisor Assistant (generation, revision, acceptance)
8. Public page updates (dynamic team, blog archive)
9. SEO + performance optimization
10. Testing + security audit + launch
