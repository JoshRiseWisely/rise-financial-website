-- Row Level Security Policies

-- Profiles: Read all, write own or admin
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blog Posts: Advisors see own/published, admins/compliance see all
CREATE POLICY "blog_read" ON public.blog_posts FOR SELECT USING (
  author_id = auth.uid() OR 
  status = 'published' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

CREATE POLICY "blog_write" ON public.blog_posts FOR INSERT WITH CHECK (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "blog_update" ON public.blog_posts FOR UPDATE USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "blog_delete" ON public.blog_posts FOR DELETE USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages: Same as blog
CREATE POLICY "pages_read" ON public.pages FOR SELECT USING (
  author_id = auth.uid() OR 
  status = 'published' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

CREATE POLICY "pages_write" ON public.pages FOR INSERT WITH CHECK (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "pages_update" ON public.pages FOR UPDATE USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "pages_delete" ON public.pages FOR DELETE USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Advisor Profiles: Public can read published, owners/admin can edit
CREATE POLICY "advisor_profiles_read" ON public.advisor_profiles FOR SELECT USING (
  is_published = true OR
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

CREATE POLICY "advisor_profiles_update" ON public.advisor_profiles FOR UPDATE USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Compliance Queue: Submitters see own, compliance/admin see all
CREATE POLICY "compliance_read" ON public.compliance_queue FOR SELECT USING (
  submitted_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

CREATE POLICY "compliance_insert" ON public.compliance_queue FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'advisor', 'compliance'))
);

CREATE POLICY "compliance_update" ON public.compliance_queue FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

-- Audit Logs: Admin and compliance only
CREATE POLICY "audit_read" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'compliance'))
);

CREATE POLICY "audit_insert" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- AI Generations: Own or admin
CREATE POLICY "ai_gen_read" ON public.ai_generations FOR SELECT USING (
  requested_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "ai_gen_write" ON public.ai_generations FOR INSERT WITH CHECK (
  auth.uid() = requested_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "ai_gen_update" ON public.ai_generations FOR UPDATE USING (
  requested_by = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
