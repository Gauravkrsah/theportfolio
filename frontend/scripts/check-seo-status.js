/**
 * This script checks the current SEO status of the website
 * It verifies that all required SEO elements are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

/**
 * SEO checklist items
 */
const seoChecklist = [
  {
    name: 'Sitemap XML',
    file: path.join(publicDir, 'sitemap.xml'),
    check: (content) => content.includes('<?xml version="1.0"') && content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  },
  {
    name: 'Image Sitemap XML',
    file: path.join(publicDir, 'image-sitemap.xml'),
    check: (content) => content.includes('<?xml version="1.0"') && content.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')
  },
  {
    name: 'Robots.txt',
    file: path.join(publicDir, 'robots.txt'),
    check: (content) => content.includes('Sitemap:') && content.includes('User-agent:')
  },
  {
    name: 'Manifest.json',
    file: path.join(publicDir, 'manifest.json'),
    check: (content) => {
      try {
        const json = JSON.parse(content);
        return json.name && json.short_name && json.icons && json.icons.length > 0;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'SEO Component',
    file: path.join(rootDir, 'src', 'components', 'ui', 'SEO.tsx'),
    check: (content) => content.includes('<Helmet>') && content.includes('canonical')
  },
  {
    name: 'OptimizedImage Component',
    file: path.join(rootDir, 'src', 'components', 'ui', 'OptimizedImage.tsx'),
    check: (content) => content.includes('loading={') && content.includes('decoding="async"')
  },
  {
    name: 'SEO Helpers',
    file: path.join(rootDir, 'src', 'lib', 'utils', 'seoHelpers.ts'),
    check: (content) => content.includes('createBreadcrumbs') && content.includes('createBlogStructuredData')
  },
  {
    name: 'Sitemap Generator Script',
    file: path.join(rootDir, 'scripts', 'generate-sitemap.js'),
    check: (content) => content.includes('generateSitemap') && content.includes('writeFileSync')
  },
  {
    name: 'Prerender URLs Script',
    file: path.join(rootDir, 'scripts', 'generate-prerender-urls.js'),
    check: (content) => content.includes('generatePrerenderUrls') && content.includes('prerender: true')
  },
];

/**
 * Check if a file exists and passes the check function
 */
function checkFile(item) {
  try {
    if (!fs.existsSync(item.file)) {
      return { success: false, message: 'File not found' };
    }
    
    const content = fs.readFileSync(item.file, 'utf-8');
    const checkResult = item.check(content);
    
    return { 
      success: checkResult, 
      message: checkResult ? 'Looks good!' : 'Content validation failed'
    };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
}

/**
 * Run all SEO checks and print a status report
 */
function runSeoChecks() {
  console.log(chalk.bold.blue('SEO Status Check'));
  console.log(chalk.gray('='.repeat(50)));
  
  let passedChecks = 0;
  
  seoChecklist.forEach((item) => {
    const result = checkFile(item);
    
    if (result.success) {
      console.log(`${chalk.green('✓')} ${item.name}: ${chalk.green(result.message)}`);
      passedChecks++;
    } else {
      console.log(`${chalk.red('✗')} ${item.name}: ${chalk.red(result.message)}`);
    }
  });
  
  console.log(chalk.gray('-'.repeat(50)));
  console.log(`SEO Status: ${passedChecks} / ${seoChecklist.length} checks passed`);
  
  const seoScore = Math.floor((passedChecks / seoChecklist.length) * 100);
  
  if (seoScore >= 90) {
    console.log(chalk.green(`SEO Score: ${seoScore}% - Excellent!`));
  } else if (seoScore >= 70) {
    console.log(chalk.yellow(`SEO Score: ${seoScore}% - Good, but improvements needed`));
  } else {
    console.log(chalk.red(`SEO Score: ${seoScore}% - Needs significant improvement`));
  }
  
  // Additional SEO recommendations
  console.log(chalk.gray('='.repeat(50)));
  console.log(chalk.bold.blue('SEO Recommendations:'));
  
  // Always recommend these best practices
  if (passedChecks < seoChecklist.length) {
    console.log('1. Complete the missing SEO elements identified above');
  }
  
  console.log('2. Consider implementing these additional SEO improvements:');
  console.log('   - Add OpenGraph tags for better social sharing');
  console.log('   - Optimize page loading speed (lighthouse score)');
  console.log('   - Ensure all images have proper alt text');
  console.log('   - Implement schema.org structured data for all page types');
  console.log('   - Add breadcrumb navigation with structured data');
  console.log('   - Ensure proper heading hierarchy (h1, h2, etc.)');
  
  console.log(chalk.gray('='.repeat(50)));
}

// Run the SEO checks
runSeoChecks();
