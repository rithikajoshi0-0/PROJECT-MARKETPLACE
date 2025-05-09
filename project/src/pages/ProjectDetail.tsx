import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, api } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Calendar, 
  Tag as TagIcon, 
  Github, 
  ShoppingCart, 
  Download, 
  AlertCircle 
} from 'lucide-react';
import Button from '../components/Button';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const fetchedProject = await api.getProject(id);
        setProject(fetchedProject);
        
        if (user) {
          const purchased = await api.hasPurchased(user.id, id);
          setHasPurchased(purchased);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!project) return;

    setPurchasing(true);
    try {
      await api.purchaseProject(user.id, project.id);
      setHasPurchased(true);
    } catch (error) {
      console.error('Error purchasing project:', error);
      setError('Failed to purchase project');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>Back to Marketplace</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Project Image */}
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {project.price === 0 ? 'Free' : `$${project.price}`}
                </span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1 text-gray-500" />
                <span>Updated recently</span>
              </div>

              {project.user && (
                <div className="flex items-center">
                  <span className="mr-1">by</span>
                  <span className="font-medium">{project.user.name}</span>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
            </div>

            {project.github_link && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Repository</h2>
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Github className="h-5 w-5 mr-2" />
                  View on GitHub
                </a>
              </div>
            )}

            <div className="mt-10 space-y-4">
              {hasPurchased ? (
                <div className="rounded-md bg-green-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Download className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        You've purchased this project
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>You can now access all project files and resources.</p>
                      </div>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="success"
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Download Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                project.price > 0 ? (
                  <Button
                    size="lg"
                    fullWidth
                    isLoading={purchasing}
                    leftIcon={<ShoppingCart className="h-5 w-5" />}
                    onClick={handlePurchase}
                  >
                    {user ? `Buy Now - $${project.price}` : 'Log in to Purchase'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    fullWidth
                    variant="success"
                    leftIcon={<Download className="h-5 w-5" />}
                    onClick={handlePurchase}
                  >
                    Download Free Project
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;