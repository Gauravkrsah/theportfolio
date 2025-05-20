
/**
 * Project type definition for SEO helpers
 */
export interface ProjectType {
  id: string;
  title: string;
  description?: string;
  summary?: string; // Alternative field for description
  content?: string;
  image_url?: string;
  technologies?: string[];
  tags?: string[];
  featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  github_url?: string;
  live_url?: string;
  video_url?: string;
}
