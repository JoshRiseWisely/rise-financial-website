-- Public "media" bucket for site assets (marketing video, etc.)
-- Kept separate from "uploads", which holds per-user admin uploads keyed by profile id.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  209715200, -- 200MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Public read: these assets are served on public marketing pages
CREATE POLICY "Anyone can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Only admins manage site media
CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
