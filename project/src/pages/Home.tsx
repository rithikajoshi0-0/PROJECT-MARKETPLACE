import React, { useEffect, useState } from 'react';
import { Project, api } from '../lib/supabase';
import { Search } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import FilterSidebar from '../components/FilterSidebar';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await api.getProjects();
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
        
        // Extract all unique tags
        const tags = new Set<string>();
        fetchedProjects.forEach((project) => {
          project.tags.forEach((tag) => {
            tags.add(tag);
          });
        });
        setAvailableTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(lowercaseQuery) ||
          project.description.toLowerCase().includes(lowercaseQuery) ||
          project.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const handleApplyFilters = async (filters: {
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setLoading(true);
    try {
      const filteredProjects = await api.getProjects(filters);
      setFilteredProjects(filteredProjects);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Find the perfect project
            </h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Browse high-quality code projects built by talented developers. Buy, extend, and deploy.
            </p>
            <div className="mt-8 max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-lg border-gray-300 rounded-l-md"
                    placeholder="Search projects, technologies..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <FilterSidebar 
            onApplyFilters={handleApplyFilters} 
            availableTags={availableTags} 
          />
          
          {/* Project Grid */}
          <div className="col-span-1 md:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Available
              </h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">
                  Try changing your search terms or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;