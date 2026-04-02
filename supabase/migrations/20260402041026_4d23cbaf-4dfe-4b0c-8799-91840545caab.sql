INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

CREATE POLICY "Public read content images" ON storage.objects FOR SELECT USING (bucket_id = 'content-images');
CREATE POLICY "Service role upload content images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content-images');