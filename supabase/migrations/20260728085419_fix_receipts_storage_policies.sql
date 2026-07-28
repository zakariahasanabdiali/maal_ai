-- Fix: No storage policies exist for the receipts bucket.
-- Without policies, uploads fail with "new row violates row-level security policy".
-- Allow authenticated users to upload to and read from the receipts bucket.

CREATE POLICY "allow_auth_uploads_receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "allow_auth_reads_receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'receipts');

CREATE POLICY "allow_auth_deletes_receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'receipts');