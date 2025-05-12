import React, { useState, useEffect } from 'react';
import { Project, CustomProject, User, api } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Users, 
  Package, 
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';
import Button from '../components/Button';

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const allProjects = await api.getProjects();
        setProjects(allProjects.filter(p => p.status === 'Pending'));
        setCustomProjects(mockCustomProjects);
        setSellers(mockUsers.filter(u => u.role === 'Seller'));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (projectId: string) => {
    if (!user) return;
    try {
      await api.approveProject(projectId, user.id);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId: string) => {
    try {
      await api.rejectProject(projectId, feedback);
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
      setFeedback('');
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Sellers</p>
                <p className="text-2xl font-semibold text-gray-900">{sellers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Custom Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{customProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$1,234</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Reviews</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {projects.map(project => (
              <div key={project.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-6 flex space-x-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApprove(project.id)}
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      leftIcon={<XCircle className="h-4 w-4" />}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                      leftIcon={<MessageSquare className="h-4 w-4" />}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Custom Project Requests</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {customProjects.map(project => (
              <div key={project.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Budget: ${project.budget}
                      </span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Button
                      onClick={() => {/* Handle assigning project */}}
                      leftIcon={<Users className="h-4 w-4" />}
                    >
                      Assign Developer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reject Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Reject Project
                    </h3>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Provide feedback for rejection..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <Button
                    variant="danger"
                    onClick={() => handleReject(selectedProject.id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedProject(null);
                      setFeedback('');
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
