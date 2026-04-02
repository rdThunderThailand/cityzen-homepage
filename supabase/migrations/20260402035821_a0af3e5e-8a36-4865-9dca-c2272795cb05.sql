
-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true);

-- Allow anyone to upload images to report-images bucket
CREATE POLICY "Anyone can upload report images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'report-images');

-- Allow public read access to report images
CREATE POLICY "Public read access to report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');
