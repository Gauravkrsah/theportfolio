/**
 * Generate a list of URLs for prerendering at build time
 * This script is used to improve SEO by pre-rendering critical routes
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are not defined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Functions to get data
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
}

async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data || [];
}

/**
 * Generate a list of URLs to prerender for better SEO
 */
async function generatePrerenderUrls() {
  try {
    // Get all dynamic content
    const projects = await getProjects();
    const blogs = await getBlogPosts();
    
    // Static pages
    const staticUrls = [
      '/',
      '/projects',
      '/blogs',
      '/contents',
      '/contacts',
    ];
    
    // Add project pages
    const projectUrls = projects.map(project => `/projects/${project.id}`);
    
    // Add blog pages
    const blogUrls = blogs.map(blog => `/blogs/${blog.id}`);
    
    // Combine all URLs
    const allUrls = [...staticUrls, ...projectUrls, ...blogUrls];
    
    // Create output
    const output = {
      routes: allUrls.map(url => ({
        url,
        prerender: true
      }))
    };
    
    // Write output file for Vite prerender plugin to use
    fs.writeFileSync(
      path.join(rootDir, 'prerender-urls.json'),
      JSON.stringify(output, null, 2)
    );
    
    console.log(`Generated prerender configuration with ${allUrls.length} URLs`);
    
  } catch (error) {
    console.error('Error generating prerender URLs:', error);
  }
}

// Run the generator
generatePrerenderUrls();
