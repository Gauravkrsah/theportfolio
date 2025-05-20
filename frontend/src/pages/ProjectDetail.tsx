import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Link2, Github, ExternalLink, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';
import ReactMarkdown from 'react-markdown';
import ContentPopup from '@/components/ui/ContentPopup';
import SEO from '@/components/ui/SEO';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch project details from Supabase
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id || ''),
    enabled: !!id
  });
  // Create structured data for the project
  const createProjectStructuredData = (project: Project) => {
    if (!project) return null;
    
    return {
      "@context": "https://schema.org",      "@type": "CreativeWork",
      "name": project.title,
      "description": project.description || project.title,
      "image": project.image_url || project.additional_images?.[0] || "/placeholder.svg",
      "datePublished": project.created_at,
      "dateModified": project.updated_at || project.created_at,
      "author": {
        "@type": "Person",
        "name": "Gaurav Kr Sah"
      },
      "creator": {
        "@type": "Person",
        "name": "Gaurav Kr Sah" 
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://your-domain.com/projects/${project.id}`
      },
      "keywords": project.technologies?.join(', ') || '',
      "url": `https://your-domain.com/projects/${project.id}`
    };
  };
  
  useEffect(() => {
    // We'll keep this for browsers/crawlers that don't support the Helmet approach
    if (project) {
      document.title = `${project.title} | Portfolio`;
    }
    
    // Animation delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, [project]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Create an array of images for the gallery
  const projectImages = React.useMemo(() => {
    if (!project) return [];
    
    // Combine main image with additional images
    const images = [project.image_url];
    if (project.additional_images && project.additional_images.length > 0) {
      images.push(...project.additional_images);
    }
    return images;
  }, [project]);
  
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#151515] text-white">
        {/* Mobile navbar - only visible on mobile */}
        <MobileNavbar />
        
        <div className="flex flex-1 pt-[60px] lg:pt-0">
          {/* Left sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <LeftSidebar />
          </div>
          
          {/* Main content - always visible */}
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#FFB600]" />
          </main>
          
          {/* Right sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <RightSidebar />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen bg-[#151515] text-white">
        {/* Mobile navbar - only visible on mobile */}
        <MobileNavbar />
        
        <div className="flex flex-1 pt-[60px] lg:pt-0">
          {/* Left sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <LeftSidebar />
          </div>
          
          {/* Main content - always visible */}
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
              <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
              <Link to="/projects">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
            </div>
          </main>
          
          {/* Right sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <RightSidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#151515] text-white">
      <SEO 
        title={`${project.title} | Portfolio`}        description={project.description || `Learn more about ${project.title} - a project by Gaurav Kr Sah`}
        keywords={project.technologies?.join(', ') || 'project, portfolio'}
        ogImage={project.image_url || project.additional_images?.[0] || "/placeholder.svg"}
        ogType="article"
        canonicalUrl={`/projects/${id}`}
        structuredData={createProjectStructuredData(project)}
      />
      {/* Mobile navbar - only visible on mobile */}
      <MobileNavbar />
      
      <div className="flex flex-1 pt-[60px] lg:pt-0">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        
        {/* Main content - always visible */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-screen pb-14 lg:pb-0">
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
              <div className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}>
                <div className="mb-6">
                  <Link 
                    to="/projects" 
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                  </Link>
                </div>
                
                <div className="space-y-6">
                  {/* Project header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#FFB600]/80 text-[#151515] font-medium text-xs rounded-full">
                        {project.technologies && project.technologies.length > 0 ? project.technologies[0] : 'Project'}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                  </div>
                  
                  {/* Image gallery */}
                  {projectImages.length > 0 && (
                    <div className="space-y-2">
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-[#FFB600]/20">
                        <img 
                          src={projectImages[activeImageIndex]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Thumbnails - only show if there are multiple images */}
                      {projectImages.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {projectImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={cn(
                                "relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border-2",
                                activeImageIndex === index ? "border-[#FFB600]" : "border-transparent"
                              )}
                            >
                              <img 
                                src={image} 
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Project details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-xl font-semibold mb-3">Overview</h2>
                      <div className="text-gray-300 space-y-4 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{project.content}</ReactMarkdown>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-3">Technologies</h2>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 bg-[#FFB600]/10 border border-[#FFB600]/20 text-gray-300 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Links */}
                      <div>
                        {/* Video Link */}
                        {project.video_url && (
                          <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-3">Video</h2>
                            <div 
                              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border border-[#FFB600]/20 bg-black/50"
                              onClick={() => setIsVideoPopupOpen(true)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-[#FFB600]/90 flex items-center justify-center shadow-lg">
                                  <Play className="h-8 w-8 text-[#151515] ml-1" fill="#151515" />
                                </div>
                              </div>
                              <div className="absolute bottom-3 left-3 text-white font-medium text-sm">
                                Watch Project Video
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <h2 className="text-xl font-semibold mb-3">Links</h2>
                        <div className="space-y-2">
                          {project.live_url && (
                            <a 
                              href={project.live_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-[#FFB600] hover:text-[#e2eeff] transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Live Demo
                            </a>
                          )}
                          {project.github_url && (
                            <a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-[#FFB600] hover:text-[#e2eeff] transition-colors"
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </main>
        
        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
      
      {/* Video Popup */}
      {project.video_url && (
        <ContentPopup
          open={isVideoPopupOpen}
          onOpenChange={setIsVideoPopupOpen}
          title={project.title}
          url={project.video_url}
          platform={project.video_platform || 'YouTube'}
          contentType="video"
        />
      )}
    </div>
  );
};

export default ProjectDetail;