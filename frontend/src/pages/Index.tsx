import React from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MainContent from '@/components/layout/MainContent';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ThemeProvider } from '@/hooks/use-theme';
import SEO from '@/components/ui/SEO';

const Index: React.FC = () => {
  // Structured data for home page (JSON-LD)
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Portfolio - Professional Showcase",
    "description": "Professional portfolio showcasing design, development, and marketing expertise",
    "mainEntity": {
      "@type": "Person",
      "name": "Gaurav Kr Sah",
      "url": "https://your-domain.com",
      "jobTitle": "Designer, Developer, Marketer",
      "description": "Expert in design, development, and marketing"
    }
  };
  return (
    <ThemeProvider>
      <SEO 
        title="GauravKrSah | Design Develop Market"
        description="Professional portfolio showcasing expertise in design, development, and marketing solutions. Explore my projects, blogs, and services."
        keywords="portfolio, design, development, marketing, projects, blogs"
        ogImage="/placeholder.svg"
        canonicalUrl="/"
        structuredData={homePageStructuredData}
      />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Mobile navbar - only visible on mobile */}
        <MobileNavbar />
        
        <div className="flex flex-1 pt-[60px] lg:pt-0">
          {/* Left sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <LeftSidebar />
          </div>
          
          {/* Main content - always visible */}
          <MainContent />
          
          {/* Right sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <RightSidebar />
          </div>
        </div>
        
      </div>
    </ThemeProvider>
  );
};

export default Index;
