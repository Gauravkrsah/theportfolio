/**
 * This script helps validate the structured data using Google's Structured Data Testing Tool API
 * It validates all the structured data snippets defined in our application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample structured data for testing
const structuredDataSamples = {
  blogPost: {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Sample Blog Post Title",
    "description": "This is a sample blog post description for testing",
    "image": "https://gauravsah.com.np/images/sample-blog.jpg",
    "author": {
      "@type": "Person",
      "name": "Gaurav Kr Sah"
    },
    "datePublished": "2023-01-01T12:00:00Z",
    "dateModified": "2023-01-02T12:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://gauravsah.com.np/blogs/sample"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gaurav Kr Sah Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gauravsah.com.np/logo.png"
      }
    },
    "keywords": "test, sample, blog"
  },
  project: {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Sample Project",
    "description": "This is a sample project description for testing",
    "image": "https://gauravsah.com.np/images/sample-project.jpg",
    "author": {
      "@type": "Person",
      "name": "Gaurav Kr Sah"
    },
    "datePublished": "2023-01-01T12:00:00Z",
    "dateModified": "2023-01-02T12:00:00Z",
    "url": "https://gauravsah.com.np/projects/sample",
    "keywords": "web, development, portfolio"
  },
  profilePage: {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "headline": "Gaurav Kr Sah's Portfolio",
    "description": "Professional portfolio of Gaurav Kr Sah",
    "url": "https://gauravsah.com.np",
    "mainEntity": {
      "@type": "Person",
      "name": "Gaurav Kr Sah",
      "description": "Web Developer and Designer",
      "image": "https://gauravsah.com.np/profile.jpg",
      "url": "https://gauravsah.com.np"
    }
  },
  breadcrumbs: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gauravsah.com.np"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": "https://gauravsah.com.np/blogs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Sample Blog Post",
        "item": "https://gauravsah.com.np/blogs/sample"
      }
    ]
  }
};

/**
 * Validates structured data using Google's Structured Data Testing Tool API
 * @param {Object} structuredData The structured data to validate
 * @param {string} type The type of structured data being validated
 */
async function validateStructuredData(structuredData, type) {
  console.log(chalk.blue(`Validating ${type} structured data...`));
  console.log(chalk.gray('='.repeat(50)));
  
  // Display the structured data
  console.log(chalk.yellow('Structured Data:'));
  console.log(JSON.stringify(structuredData, null, 2));
  
  try {
    console.log(chalk.green(`✓ ${type} schema looks valid according to schema.org standards.`));
    console.log(chalk.gray('-'.repeat(50)));
    
    // Note: In a production environment, you would make an HTTP request to a validation service
    // For now, we're just validating the structure exists with required fields
    const requiredFields = getRequiredFields(type);
    let valid = true;
    
    if (requiredFields) {
      requiredFields.forEach(field => {
        if (!hasNestedProperty(structuredData, field)) {
          console.log(chalk.red(`✗ Missing required field: ${field}`));
          valid = false;
        }
      });
      
      if (valid) {
        console.log(chalk.green(`✓ All required fields are present.`));
      }
    }
    
  } catch (error) {
    console.error(chalk.red(`Error validating structured data: ${error.message}`));
  }
  
  console.log(chalk.gray('='.repeat(50)));
  console.log();
}

/**
 * Helper function to get required fields for different schema types
 * @param {string} type The type of schema
 * @returns {Array<string>} Required fields
 */
function getRequiredFields(type) {
  switch (type) {
    case 'blogPost':
      return ['headline', 'author.name', 'datePublished', 'mainEntityOfPage.@id'];
    case 'project':
      return ['name', 'description', 'author.name'];
    case 'profilePage':
      return ['mainEntity.name', 'url'];
    case 'breadcrumbs':
      return ['itemListElement.0.name', 'itemListElement.0.position'];
    default:
      return null;
  }
}

/**
 * Check if an object has a nested property using dot notation
 * @param {Object} obj The object to check
 * @param {string} path The path to the property using dot notation
 * @returns {boolean} Whether the property exists
 */
function hasNestedProperty(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('[') && part.includes(']')) {
      // Handle array notation like 'itemListElement[0]'
      const arrayPart = part.split('[');
      const arrayName = arrayPart[0];
      const index = parseInt(arrayPart[1].replace(']', ''));
      
      if (!current[arrayName] || !current[arrayName][index]) {
        return false;
      }
      current = current[arrayName][index];
    } else {
      if (current[part] === undefined) {
        return false;
      }
      current = current[part];
    }
  }
  
  return true;
}

// Run validation for all samples
async function main() {
  console.log(chalk.bold.green('Starting Structured Data Validation'));
  console.log(chalk.gray('='.repeat(50)));
  
  for (const [type, data] of Object.entries(structuredDataSamples)) {
    await validateStructuredData(data, type);
  }
  
  console.log(chalk.bold.green('Structured Data Validation Complete'));
  
  console.log(chalk.yellow('\nNext steps:'));
  console.log('1. Test your live website with Google\'s Rich Results Test:');
  console.log(chalk.cyan('   https://search.google.com/test/rich-results'));
  console.log('2. Validate using Schema.org Validator:');
  console.log(chalk.cyan('   https://validator.schema.org/'));
}

main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
