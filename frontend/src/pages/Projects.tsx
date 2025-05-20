import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';
import SEO from '@/components/ui/SEO';

// Define category groups with hierarchical structure
const categoryGroups = [
  {
    name: "All",
    categories: ["All"]
  },
  {
    name: "Design",
    categories: [
      "UI/UX Design",
      "Web Design",
      "Mobile App Design",
      "Graphic Design",
      "Branding & Identity",
      "Social Media Creatives",
      "Motion Graphics"
    ]
  },
  {
    name: "Development",
    categories: [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "Web App Development",
      "WordPress/Shopify",
      "E-commerce Development",
      "Landing Pages"
    ]
  },
  {
    name: "Marketing",
    categories: [
      "Digital Marketing",
      "SEO",
      "Social Media Marketing",
      "Content Marketing",
      "Paid Advertising",
      "Email Marketing",
      "Influencer Marketing"
    ]
  },
  {
    name: "Other",
    categories: [
      "AI/ML Projects",
      "Automation Projects",
      "Data Analytics",
      "Open Source",
      "Research Projects",
      "Workshops & Trainings",
      "Collaborations"
    ]
  }
];

// Flatten categories for filtering
const allCategories = categoryGroups.flatMap(group => group.categories);

const Projects: React.FC = () => {
  useEffect(() => {
    document.title = "Projects | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch projects from Supabase
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });  // Improved filter logic with cleaner implementation
  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    
    return projects.filter(project => {
      // Determine if project matches the selected category
      let matchesCategory = false;
      
      if (activeCategory === "All") {
        // When "All" is selected, show all projects
        matchesCategory = true;
      } else {
        // Find the parent category group of the selected category/subcategory
        const parentCategoryGroup = categoryGroups.find(group => 
          group.name === activeCategory || group.categories.includes(activeCategory)
        );
        
        if (parentCategoryGroup) {
          // If the active category is a main category (matches a group name)
          if (parentCategoryGroup.name === activeCategory) {
            // Match any technology that relates to this category group
            matchesCategory = project.technologies?.some(tech => {
              // Direct match with the category name
              const directCategoryMatch = tech.toLowerCase() === activeCategory.toLowerCase();
              
              // Check if any technology contains the category name
              const containsCategoryName = tech.toLowerCase().includes(activeCategory.toLowerCase());
              
              // Also match any subcategory in this group
              const matchesSubcategory = parentCategoryGroup.categories.some(subcat => 
                tech.toLowerCase().includes(subcat.toLowerCase())
              );
              
              return directCategoryMatch || containsCategoryName || matchesSubcategory;
            }) || false;
          } else {
            // It's a subcategory, so check for specific match with the subcategory
            matchesCategory = project.technologies?.some(tech => {
              // Direct match with selected subcategory
              const directMatch = tech.toLowerCase() === activeCategory.toLowerCase();
              
              // If no direct match, check if technology contains the subcategory name
              const containsSubcategory = tech.toLowerCase().includes(activeCategory.toLowerCase());
              
              return directMatch || containsSubcategory;
            }) || false;
          }
        }
      }
      
      // Check if project matches the search query
      const matchesSearch = 
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) || 
        false;
      
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
    // Handle main category click - improved logic
  const handleMainCategoryClick = (categoryName: string) => {
    // If "All" is selected, immediately apply filter and clear any expanded category
    if (categoryName === "All") {
      setActiveCategory("All");
      setExpandedCategory(null);
      return;
    }
    
    // If clicking on the already expanded category
    if (expandedCategory === categoryName) {
      // Just collapse without changing the active category
      setExpandedCategory(null);
    } else {
      // Expand the clicked category
      setExpandedCategory(categoryName);
      
      // Also set the main category as active to show all items in this category
      // This makes the filter behavior more intuitive as clicking a main category
      // will show all items in that category
      setActiveCategory(categoryName);
    }
  };
  
  // Handle subcategory click - improved behavior
  const handleSubCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Keep the parent category expanded when selecting a subcategory
    // This maintains context and makes the UI more intuitive
  };
  
  // Add CSS styles to head using useEffect
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Custom scrollbar for subcategory containers */
      .subcategories-container::-webkit-scrollbar {
        width: 4px;
      }
      
      .subcategories-container::-webkit-scrollbar-track {
        background: rgba(31, 41, 55, 0.5);
        border-radius: 10px;
      }
      
      .subcategories-container::-webkit-scrollbar-thumb {
        background: rgba(255, 182, 0, 0.5);
        border-radius: 10px;
      }
      
      .subcategories-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 182, 0, 0.8);
      }
    `;
    
    // Add style element to head
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Structured data for Projects page
  const projectsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Projects Portfolio",
    "description": "Showcase of creative and technical projects spanning design, development, and marketing",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredProjects?.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description,
          "image": project.image_url || "/placeholder.svg",
          "url": `https://your-domain.com/projects/${project.id}`
        }
      })) || []
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#151515] text-white">
      <SEO 
        title="Projects | Professional Portfolio"
        description="Explore my showcase of creative and technical projects spanning design, development, and marketing solutions."
        keywords="projects, portfolio, web design, development, marketing, UI/UX"
        canonicalUrl="/projects"
        structuredData={projectsStructuredData}
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
            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            )}>
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Projects</h1>
                <p className="text-gray-400 text-sm">A showcase of my development and design work</p>
              </div>              {/* Flex container for search and filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Search input - completely revamped to avoid any borders */}
                  <div className="w-full sm:w-64 lg:w-72 order-1 sm:order-2 sm:ml-auto">
                    <label className="relative block">
                      <span className="sr-only">Search</span>
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-full bg-[#1e293b]/70 py-2 pl-10 pr-3 text-white text-xs appearance-none focus:outline-none"
                        style={{
                          boxShadow: 'none',
                          WebkitAppearance: 'none'
                        }}
                      />
                    </label>
                  </div>
                  
                  {/* Categories container */}
                  <div className="space-y-3 order-2 sm:order-1 w-full sm:w-auto">
                    {/* Main Categories */}                  <div className="flex flex-wrap gap-2">
                    {categoryGroups.map((group) => {
                      // Improved active state detection logic
                      const isCategoryMatch = activeCategory === group.name;
                      const isParentOfActive = group.name !== "All" && 
                                            group.categories.includes(activeCategory);
                      const isAllAndAllActive = group.name === "All" && activeCategory === "All";
                      const isExpanded = expandedCategory === group.name;
                      
                      // Determine active state using improved logic
                      const isActive = isCategoryMatch || isParentOfActive || isAllAndAllActive;
                      
                      return (
                        <button
                          key={group.name}
                          onClick={() => handleMainCategoryClick(group.name)}
                          className={cn(
                            "px-3 sm:px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-all duration-300",
                            isActive
                              ? "bg-[#FFB600] text-[#151515] shadow-lg shadow-[#FFB600]/20"
                              : "bg-gray-800 text-white hover:bg-gray-700 hover:shadow",
                            isExpanded && !isActive
                              ? "ring-2 ring-[#FFB600]/50" // Highlight expanded but not active
                              : "",
                            "flex items-center gap-1.5 flex-shrink-0 sm:flex-shrink min-w-[90px] sm:min-w-0 justify-center"
                          )}
                        >
                          {/* Icon for each category */}
                          <span className="mr-1">
                            {group.name === "Design" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="6"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                              </svg>
                            )}
                            {group.name === "Development" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                              </svg>
                            )}
                            {group.name === "Marketing" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
                                <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"></path>
                                <path d="M4 15v-3a6 6 0 0 1 6-6h0"></path>
                                <path d="M14 6h0a6 6 0 0 1 6 6v3"></path>
                              </svg>
                            )}
                            {group.name === "Other" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="8"></circle>
                                <path d="M12 8v4"></path>
                                <path d="M12 16h.01"></path>
                              </svg>
                            )}
                            {group.name === "All" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                              </svg>
                            )}
                          </span>
                          
                          {group.name}
                          
                          {/* Dropdown arrow for expandable categories */}
                          {group.name !== "All" && (
                            <span className="ml-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" 
                                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                                strokeLinejoin="round" className={cn(
                                  "transition-transform duration-300",
                                  expandedCategory === group.name ? "rotate-180" : ""
                                )}>
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                    {/* Subcategories - improved animated container with better UX */}
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      expandedCategory && expandedCategory !== "All" 
                        ? "opacity-100 mt-3" 
                        : "max-h-0 opacity-0 mt-0"
                    )}
                    style={{
                      maxHeight: expandedCategory && expandedCategory !== "All" ? '300px' : '0px'
                    }}
                  >
                    <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-lg border border-gray-800 max-h-[200px] overflow-y-auto subcategories-container">
                      <div className="flex justify-between items-center sticky top-0 bg-gray-900/90 py-1">
                        <h3 className="text-xs font-medium text-gray-400 mb-2">
                          {expandedCategory} Categories
                        </h3>
                        {/* Show which subcategory is active as a chip/badge */}
                        {activeCategory !== expandedCategory && activeCategory !== "All" && 
                         expandedCategory && categoryGroups.find(g => g.name === expandedCategory)?.categories.includes(activeCategory) && (
                          <span className="text-[10px] bg-[#FFB600]/20 text-[#FFB600] px-2 py-0.5 rounded-full">
                            {activeCategory}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {expandedCategory && categoryGroups
                          .find(group => group.name === expandedCategory)
                          ?.categories
                          .filter(category => category !== "All") // Don't show "All" in the subcategory list
                          .map((category, idx) => (
                            <button
                              key={category}
                              onClick={() => handleSubCategoryClick(category)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs transition-all mb-1 w-full overflow-hidden text-ellipsis whitespace-nowrap",
                                activeCategory === category 
                                  ? "bg-[#FFB600] text-[#151515] font-medium shadow-lg" 
                                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:shadow"
                              )}
                              style={{
                                animationDelay: `${idx * 50}ms`,
                                animation: "fadeInUp 0.3s ease-out forwards"
                              }}
                            >
                              {category}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Error loading projects</h3>
                  <p className="text-gray-400 text-sm">
                    There was an error loading the projects. Please try again later.
                  </p>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project, index) => (
                    <div 
                      key={project.id}
                      className={cn(
                        "transition-all duration-700",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      )}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <div className="bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 h-full flex flex-col group hover:transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="relative h-40 overflow-hidden group-hover:brightness-110 transition-all">
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />                          <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                            {/* Main category tag */}
                            {project.technologies && project.technologies.length > 0 && (
                              <span className="px-3 py-1 bg-[#FFB600]/90 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                                {(() => {
                                  // Find which main category this technology belongs to
                                  const tech = project.technologies[0];
                                  for (const group of categoryGroups) {
                                    if (group.name !== "All" && group.categories.includes(tech)) {
                                      return group.name; // Show main category name
                                    }
                                  }
                                  return tech; // Default to technology name as fallback
                                })()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow space-y-2">
                          {/* Top info row: date and additional category tags */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            {/* Date */}
                            <div className="flex items-center text-gray-400 text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(project.created_at)}
                            </div>
                            
                            {/* Additional categories as smaller tags - show only 1 additional tag if available */}
                            {project.technologies && project.technologies.length > 1 && (
                              <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] rounded-full">
                                {project.technologies[1]}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-base font-bold transition-colors group-hover:text-[#FFB600] line-clamp-1">{project.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-2">{project.description}</p>
                          <Link 
                            to={`/projects/${project.id}`}
                            className="inline-flex items-center text-sm text-[#FFB600] font-medium hover:text-[#e2eeff] transition-colors pt-2"
                          >
                            View Project <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400 text-sm">
                    No projects match your current filters. Try adjusting your search or category selection.
                  </p>                </div>
              )}
            </div>
          </ScrollArea>
        </main>
        
        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Projects;