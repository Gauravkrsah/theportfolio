import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

// Breadcrumb interface
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: any;
  breadcrumbs?: BreadcrumbItem[];
}

const SEO: FC<SEOProps> = ({
  title = 'Portfolio - Your Professional Portfolio',
  description = 'Explore my professional portfolio showcasing my work, projects, blogs, and expertise.',
  keywords = 'portfolio, developer, designer, projects, blogs, expertise',
  ogImage = '/placeholder.svg',
  ogType = 'website',
  canonicalUrl = '',
  structuredData,
  breadcrumbs = [],
}) => {// Get the base URL for canonical URLs and og:image
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://gauravsah.com.np';
    // Ensure canonicalUrl starts with a slash if it's not a full URL
  const formattedCanonicalUrl = canonicalUrl && !canonicalUrl.startsWith('http') 
    ? canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}` 
    : canonicalUrl;
    
  // Create the full canonical URL
  const fullCanonicalUrl = formattedCanonicalUrl
    ? formattedCanonicalUrl.startsWith('http')
      ? formattedCanonicalUrl
      : `${baseUrl}${formattedCanonicalUrl}`
    : typeof window !== 'undefined'
      ? window.location.href
      : baseUrl;
    // Ensure ogImage starts with a slash if it's a relative path
  const formattedOgImage = ogImage && !ogImage.startsWith('http')
    ? ogImage.startsWith('/') ? ogImage : `/${ogImage}`
    : ogImage;
    
  const fullOgImageUrl = formattedOgImage && formattedOgImage.startsWith('http')
    ? formattedOgImage
    : `${baseUrl}${formattedOgImage}`;
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Gaurav Kr Sah" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Gaurav Kr Sah Portfolio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yourtwitterhandle" /> {/* Replace with actual Twitter handle */}
      <meta name="twitter:creator" content="@yourtwitterhandle" /> {/* Replace with actual Twitter handle */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Theme color for browser UI */}
      <meta name="theme-color" content="#151515" />
      
      {/* Mobile app capability */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Gaurav Kr Sah Portfolio" />
      
      {/* Structured Data (JSON-LD) */}      {/* Structured Data (JSON-LD) for main content */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Breadcrumbs structured data */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
