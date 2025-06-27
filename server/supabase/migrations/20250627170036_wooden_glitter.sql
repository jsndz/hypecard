/*
  # Create webhook events table

  1. New Tables
    - `webhook_events`
      - `id` (serial, primary key) - auto-incrementing event ID
      - `event_type` (text, not null) - type of webhook (e.g., 'revenuecat')
      - `user_id` (uuid, nullable) - associated user ID if applicable
      - `event_data` (jsonb, not null) - full webhook payload
      - `processed_at` (timestamptz, default: now()) - processing timestamp

  2. Security
    - Enable RLS on `webhook_events` table
    - Add policy for service role access only (webhooks run with service role)

  3. Indexes
    - Index on event_type for filtering
    - Index on processed_at for chronological queries
    - Index on user_id for user-specific queries
*/

CREATE TABLE IF NOT EXISTS webhook_events (
  id serial PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid,
  event_data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_user_id ON webhook_events(user_id);

-- Enable Row Level Security
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Policy for service role access (webhooks use service role key)
CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to read their own webhook events
CREATE POLICY "Users can read own webhook events"
  ON webhook_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);