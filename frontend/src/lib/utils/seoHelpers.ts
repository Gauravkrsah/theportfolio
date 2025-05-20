/**
 * SEO Helper functions for generating structured data and managing SEO elements
 */
import { BlogPost } from "@/lib/services/supabaseClient";
import { ProjectType } from "@/types"; // Update with your actual project type path

/**
 * Create breadcrumb items based on the current path
 * @param currentPath Current path without domain
 * @param currentName Current page name
 * @param additionalCrumbs Additional breadcrumb items to add
 * @returns Array of breadcrumb items
 */
export const createBreadcrumbs = (
  currentPath: string,
  currentName: string,
  additionalCrumbs: { name: string; url: string }[] = []
) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
  ];

  // Add any additional breadcrumbs
  breadcrumbs.push(...additionalCrumbs);

  // Add current page
  breadcrumbs.push({ name: currentName, url: currentPath });
  
  return breadcrumbs;
};

/**
 * Create structured data for blog posts
 * @param blog Blog post data
 * @param url Full URL to the blog post
 * @returns JSON-LD structured data object
 */
export const createBlogStructuredData = (blog: BlogPost, url: string) => {
  if (!blog) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.summary || blog.title,
    "image": blog.image_url || "/placeholder.svg",
    "author": {
      "@type": "Person",
      "name": blog.author || "Gaurav Kr Sah"
    },
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gaurav Kr Sah Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gauravsah.com.np/logo.png"
      }
    },
    "keywords": blog.tags?.join(', ') || ""
  };
};

/**
 * Create structured data for project pages
 * @param project Project data
 * @param url Full URL to the project
 * @returns JSON-LD structured data object
 */
export const createProjectStructuredData = (project: ProjectType, url: string) => {
  if (!project) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description || project.title,
    "image": project.image_url || "/placeholder.svg",
    "author": {
      "@type": "Person",
      "name": "Gaurav Kr Sah"
    },
    "datePublished": project.created_at,
    "dateModified": project.updated_at || project.created_at,
    "url": url,
    "keywords": project.tags?.join(', ') || ""
  };
};

/**
 * Create structured data for collection pages (listings)
 * @param title Page title
 * @param description Page description
 * @param url Full URL to the page
 * @param itemCount Number of items in the collection
 * @returns JSON-LD structured data object
 */
export const createCollectionStructuredData = (
  title: string, 
  description: string, 
  url: string,
  itemCount: number
) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": url,
    "numberOfItems": itemCount,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": itemCount,
      "itemListElement": [] // Specific items would be added if needed
    }
  };
};

/**
 * Create structured data for the home page (profile/person page)
 * @param name Person's name
 * @param description Person's description/bio
 * @param url Full URL to the page
 * @param imageUrl Profile image URL
 * @returns JSON-LD structured data object
 */
export const createProfileStructuredData = (
  name: string = "Gaurav Kr Sah",
  description: string,
  url: string,
  imageUrl: string = "/profile.jpg"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "headline": `${name}'s Portfolio`,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "Person",
      "name": name,
      "description": description,
      "image": imageUrl,
      "url": url
    }
  };
};

/**
 * Create structured data for the contact page
 * @param name Contact page name
 * @param description Contact page description
 * @param url Full URL to the contact page
 * @param contactPoints Array of contact methods
 * @returns JSON-LD structured data object
 */
export const createContactStructuredData = (
  name: string = "Contact Gaurav Kr Sah",
  description: string = "Get in touch with Gaurav Kr Sah",
  url: string,
  contactPoints: {
    email?: string;
    telephone?: string;
    contactType?: string;
    availableLanguage?: string[];
  }[] = []
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": name,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "Organization",
      "name": "Gaurav Kr Sah",
      "contactPoint": contactPoints.map(point => ({
        "@type": "ContactPoint",
        "email": point.email,
        "telephone": point.telephone,
        "contactType": point.contactType || "Customer Support",
        "availableLanguage": point.availableLanguage || ["English"]
      }))
    }
  };
};

/**
 * Create structured data for a 404 Not Found page
 * @returns JSON-LD structured data object
 */
export const createNotFoundStructuredData = (url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Not Found",
    "description": "The page you were looking for could not be found.",
    "url": url
  };
};
