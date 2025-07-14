/*
  # Blog System Schema

  1. New Tables
    - `blog_categories` - Blog post categories
    - `blog_posts` - Blog articles and content
    - `blog_comments` - User comments on blog posts

  2. Security
    - Enable RLS on all tables
    - Public read access for published posts
    - Authenticated users can comment
*/

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6a8f54',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  author_name text NOT NULL,
  author_avatar text,
  category_id uuid REFERENCES blog_categories(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  read_time_minutes integer DEFAULT 5,
  tags text[],
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Blog categories policies
CREATE POLICY "Anyone can read blog categories"
  ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Blog posts policies
CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Blog comments policies
CREATE POLICY "Anyone can read approved comments"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments"
  ON blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON blog_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);