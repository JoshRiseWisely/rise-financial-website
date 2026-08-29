-- Contact form submissions (leads)

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  investable_assets TEXT,
  current_situation TEXT,
  message TEXT,
  source TEXT DEFAULT 'Contact Page',
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')) DEFAULT 'new',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  -- Delivery tracking: a lead is durable even when the notification email fails
  email_sent BOOLEAN DEFAULT false,
  email_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads hold client PII: no public access at all.
-- Inserts come from the contact route via the service-role client, which bypasses RLS.
CREATE POLICY "leads_read" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'advisor', 'compliance'))
);

CREATE POLICY "leads_update" ON public.leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'advisor', 'compliance'))
);

CREATE POLICY "leads_delete" ON public.leads FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
