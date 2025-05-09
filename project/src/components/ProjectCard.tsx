import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../lib/supabase';
import { Tag, DollarSign, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/projects/${project.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link to={`/projects/${project.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
            <span className="font-medium text-gray-900">
              {project.price === 0 ? 'Free' : `$${project.price}`}
            </span>
          </div>
          
          <Link 
            to={`/projects/${project.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;