/*
  # Create KV Store Table for Invoice Management

  1. New Tables
    - `kv_store_ec5ebf11`
      - `key` (text, primary key) - Unique identifier for each key-value pair
      - `value` (jsonb) - JSON data stored for each key (invoice data, etc.)
  
  2. Purpose
    - This table provides a key-value store for the invoice management system
    - Used by the edge function to store and retrieve invoice data
    - Supports prefix-based queries for efficient data retrieval
  
  3. Security
    - Enable RLS on the table
    - Add policies to restrict access to authenticated service role only
*/

CREATE TABLE IF NOT EXISTS kv_store_ec5ebf11 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

ALTER TABLE kv_store_ec5ebf11 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all data"
  ON kv_store_ec5ebf11
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_ec5ebf11 (key text_pattern_ops);