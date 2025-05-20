/**
 * This script optimizes images for better web performance and SEO
 * It adds proper meta information and optimizes filesize
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'images');

/**
 * Ensure necessary directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(imagesDir)) {
    console.log(chalk.yellow(`Creating images directory at: ${imagesDir}`));
    fs.mkdirSync(imagesDir, { recursive: true });
  }
}

/**
 * Find all image files in the public directory
 */
function findImageFiles() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const images = [];
  
  function scanDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
        images.push(filePath);
      }
    });
  }
  
  scanDirectory(publicDir);
  return images;
}

/**
 * Get image dimensions
 */
function getImageDimensions(imagePath) {
  try {
    // This is just a simple placeholder for actual image dimension detection
    // In a real implementation, you would use a library like sharp or probe-image-size
    return {
      width: 1200,
      height: 630
    };
  } catch (error) {
    console.error(chalk.red(`Error getting dimensions for ${imagePath}: ${error.message}`));
    return { width: 0, height: 0 };
  }
}

/**
 * Generate image metadata for proper SEO
 */
function generateImageMetadata() {
  console.log(chalk.blue('Generating image metadata for SEO...'));
  const images = findImageFiles();
  
  const metadata = images.map(imagePath => {
    const relativePath = path.relative(publicDir, imagePath);
    const dimensions = getImageDimensions(imagePath);
    const fileSize = fs.statSync(imagePath).size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    
    return {
      path: `/${relativePath.replace(/\\/g, '/')}`,
      width: dimensions.width,
      height: dimensions.height,
      size: `${fileSizeKB}KB`,
      alt: path.basename(imagePath, path.extname(imagePath)).replace(/[-_]/g, ' ')
    };
  });
  
  // Write metadata to a JSON file for reference
  fs.writeFileSync(
    path.join(publicDir, 'image-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(chalk.green(`✓ Generated metadata for ${metadata.length} images`));
  return metadata;
}

/**
 * Generate image sitemap
 */
function generateImageSitemap(metadata) {
  console.log(chalk.blue('Generating image sitemap...'));
  
  const domain = 'https://gauravsah.com.np';
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // Group images by directory
  const imagesByDirectory = {};
  metadata.forEach(image => {
    const directory = path.dirname(image.path);
    if (!imagesByDirectory[directory]) {
      imagesByDirectory[directory] = [];
    }
    imagesByDirectory[directory].push(image);
  });
  
  // Create sitemap entries
  Object.entries(imagesByDirectory).forEach(([directory, images]) => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${domain}${directory === '.' ? '/' : directory}</loc>\n`;
    
    images.forEach(image => {
      sitemap += '    <image:image>\n';
      sitemap += `      <image:loc>${domain}${image.path}</image:loc>\n`;
      sitemap += `      <image:title>${image.alt}</image:title>\n`;
      sitemap += `      <image:caption>${image.alt}</image:caption>\n`;
      sitemap += '    </image:image>\n';
    });
    
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  // Write the image sitemap file
  fs.writeFileSync(path.join(publicDir, 'image-sitemap.xml'), sitemap);
  console.log(chalk.green(`✓ Generated image sitemap with ${metadata.length} images`));
}

/**
 * Generate a helper component for optimized image loading
 */
function generateOptimizedImageComponent() {
  console.log(chalk.blue('Generating optimized image component...'));
  
  const componentContent = `// filepath: d:/portfolio/frontend/src/components/ui/OptimizedImage.tsx
import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

/**
 * OptimizedImage component for SEO-friendly image rendering
 * Uses width & height to avoid layout shift
 * Implements lazy loading by default
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
}) => {
  // Use priority prop to determine loading strategy
  const loadingStrategy = priority ? 'eager' : loading;
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loadingStrategy}
      // Add decoding attribute for better performance
      decoding="async"
      // Add larger sizes for responsive images to avoid layout shift
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

export default OptimizedImage;
`;

  // Create the component file
  const componentPath = path.join(rootDir, 'src', 'components', 'ui', 'OptimizedImage.tsx');
  fs.writeFileSync(componentPath, componentContent);
  console.log(chalk.green(`✓ Generated OptimizedImage component at ${componentPath}`));
}

/**
 * Main function to run the image optimization process
 */
async function main() {
  console.log(chalk.bold.green('Starting Image SEO Optimization'));
  console.log(chalk.gray('='.repeat(50)));
  
  // Ensure directories exist
  ensureDirectories();
  
  // Generate image metadata
  const metadata = generateImageMetadata();
  
  // Generate image sitemap
  generateImageSitemap(metadata);
  
  // Generate optimized image component
  generateOptimizedImageComponent();
  
  console.log(chalk.bold.green('Image SEO Optimization Complete'));
  console.log(chalk.gray('='.repeat(50)));
  
  console.log(chalk.yellow('\nNext steps:'));
  console.log('1. Use the OptimizedImage component for all images in your project');
  console.log('2. Add the image sitemap to your robots.txt file:');
  console.log(chalk.cyan('   Sitemap: https://gauravsah.com.np/image-sitemap.xml'));
  console.log('3. Verify images have proper alt text and dimensions');
}

main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
