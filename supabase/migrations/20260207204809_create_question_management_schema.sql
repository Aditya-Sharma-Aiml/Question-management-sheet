/*
  # Question Management System Schema

  ## Overview
  Creates a hierarchical structure for managing questions organized by topics and sub-topics.
  
  ## New Tables
  
  ### topics
  - `id` (uuid, primary key) - Unique identifier for each topic
  - `title` (text, not null) - Title of the topic
  - `description` (text) - Optional description
  - `order_index` (integer, not null, default 0) - Position in the list for ordering
  - `created_at` (timestamptz) - Timestamp when created
  - `updated_at` (timestamptz) - Timestamp when last updated
  
  ### sub_topics
  - `id` (uuid, primary key) - Unique identifier for each sub-topic
  - `topic_id` (uuid, not null) - Foreign key to topics table
  - `title` (text, not null) - Title of the sub-topic
  - `description` (text) - Optional description
  - `order_index` (integer, not null, default 0) - Position within the topic
  - `created_at` (timestamptz) - Timestamp when created
  - `updated_at` (timestamptz) - Timestamp when last updated
  
  ### questions
  - `id` (uuid, primary key) - Unique identifier for each question
  - `topic_id` (uuid, not null) - Foreign key to topics table
  - `sub_topic_id` (uuid) - Optional foreign key to sub_topics table
  - `title` (text, not null) - Title/text of the question
  - `description` (text) - Optional detailed description
  - `order_index` (integer, not null, default 0) - Position within the sub-topic/topic
  - `created_at` (timestamptz) - Timestamp when created
  - `updated_at` (timestamptz) - Timestamp when last updated
  
  ## Security
  - Enable RLS on all tables
  - Allow public read access for demonstration purposes
  - Allow public write access for demonstration purposes (in production, this should be restricted)
*/

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sub_topics table
CREATE TABLE IF NOT EXISTS sub_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  sub_topic_id uuid REFERENCES sub_topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(order_index);
CREATE INDEX IF NOT EXISTS idx_sub_topics_topic_id ON sub_topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_sub_topics_order ON sub_topics(topic_id, order_index);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_sub_topic_id ON questions(sub_topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(topic_id, sub_topic_id, order_index);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration purposes)
-- In production, these should be more restrictive

-- Topics policies
CREATE POLICY "Allow public read access to topics"
  ON topics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to topics"
  ON topics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to topics"
  ON topics FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to topics"
  ON topics FOR DELETE
  TO anon
  USING (true);

-- Sub-topics policies
CREATE POLICY "Allow public read access to sub_topics"
  ON sub_topics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to sub_topics"
  ON sub_topics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to sub_topics"
  ON sub_topics FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to sub_topics"
  ON sub_topics FOR DELETE
  TO anon
  USING (true);

-- Questions policies
CREATE POLICY "Allow public read access to questions"
  ON questions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to questions"
  ON questions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to questions"
  ON questions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to questions"
  ON questions FOR DELETE
  TO anon
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_topics_updated_at BEFORE UPDATE ON sub_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();