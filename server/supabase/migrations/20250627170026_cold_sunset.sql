/*
  # Create videos table

  1. New Tables
    - `videos`
      - `id` (serial, primary key) - auto-incrementing video ID
      - `user_id` (uuid, foreign key) - references users.id
      - `name` (text, not null) - person's name from form
      - `role` (text, nullable) - person's role/title
      - `tagline` (text, nullable) - short tagline
      - `description` (text, nullable) - longer description
      - `avatar` (text, nullable) - avatar image URL
      - `video_url` (text, not null) - generated video URL from Tavus
      - `tavus_video_id` (text, nullable) - Tavus video ID for tracking
      - `status` (text, default: 'processing') - video generation status
      - `created_at` (timestamptz, default: now()) - creation timestamp

  2. Security
    - Enable RLS on `videos` table
    - Add policy for authenticated users to read their own videos
    - Add policy for authenticated users to create videos
    - Add policy for authenticated users to delete their own videos
    - Add policy for public read access (for card sharing)

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS videos (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  tagline text,
  description text,
  avatar text,
  video_url text NOT NULL,
  tavus_video_id text,
  status text DEFAULT 'processing',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can read own videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for public read access (for card sharing)
CREATE POLICY "Public can read video cards"
  ON videos
  FOR SELECT
  TO anon
  USING (true);