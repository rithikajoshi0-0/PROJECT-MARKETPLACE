import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../lib/supabase';
import { Bookmark } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  formatPrice: (price: number) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, formatPrice }) => {
  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500">{project.domain}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {project.price === 0 ? 'Free' : formatPrice(project.price)}
        </span>
        <Link
          to={`/projects/${project.id}`}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard
