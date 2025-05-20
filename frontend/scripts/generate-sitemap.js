// This script generates a sitemap.xml file based on your database content
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

// Domain configuration
const DOMAIN = 'https://gauravsah.com.np';
const PUBLIC_DIR = path.join(rootDir, 'public');

// Date format function
function formatDate(date) {
  return date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
}

async function generateSitemap() {
  try {
    // Get all dynamic content
    const projects = await getProjects();
    const blogs = await getBlogPosts();
    
    // Static pages with their priorities and change frequencies
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: formatDate(new Date()) },
      { url: '/projects', priority: '0.8', changefreq: 'weekly', lastmod: formatDate(new Date()) },
      { url: '/blogs', priority: '0.8', changefreq: 'weekly', lastmod: formatDate(new Date()) },
      { url: '/contents', priority: '0.7', changefreq: 'monthly', lastmod: formatDate(new Date()) },
      { url: '/contacts', priority: '0.6', changefreq: 'monthly', lastmod: formatDate(new Date()) },
    ];
    
    // Start creating the sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${DOMAIN}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    // Add project pages
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${DOMAIN}/projects/${project.id}</loc>\n`;
        sitemap += `    <lastmod>${formatDate(project.updated_at || project.created_at)}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.7</priority>\n';
        sitemap += '  </url>\n';
      });
    }
    
    // Add blog pages
    if (blogs && blogs.length > 0) {
      blogs.forEach(blog => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${DOMAIN}/blogs/${blog.id}</loc>\n`;
        sitemap += `    <lastmod>${formatDate(blog.updated_at || blog.created_at)}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.7</priority>\n';
        sitemap += '  </url>\n';
      });
    }
    
    sitemap += '</urlset>';
    
    // Write the sitemap file
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Run the generator
generateSitemap();
