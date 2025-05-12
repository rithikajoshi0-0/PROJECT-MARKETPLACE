import React, { useState, useEffect } from 'react';
import { Project, CustomProject, User, api, mockCustomProjects, mockUsers } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Users, 
  Package, 
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Send,
  Download,
  Upload
} from 'lucide-react';
import Button from '../components/Button';

type AdminTab = 'projects' | 'custom-inbox' | 'developer-matching' | 'developer-uploads' | 'buyer-deliverables';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCustomProject, setSelectedCustomProject] = useState<CustomProject | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProjects = await api.getProjects();
        setProjects(allProjects.filter(p => p.status === 'Pending'));
        const customProjs = await api.getCustomProjects();
        setCustomProjects(customProjs);
        const availableSellers = await api.getAvailableSellers('');
        setSellers(availableSellers);
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

  const handleAssignDeveloper = async () => {
    if (!selectedCustomProject || !selectedSeller) return;
    
    try {
      await api.assignCustomProject(selectedCustomProject.id, selectedSeller);
      setCustomProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === selectedCustomProject.id 
            ? { ...p, sellerId: selectedSeller, status: 'Assigned' }
            : p
        )
      );
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning developer:', error);
    }
  };

  const handleApproveDelivery = async (projectId: string) => {
    try {
      const downloadUrl = `https://example.com/download/${projectId}`;
      await api.approveCustomProject(projectId, downloadUrl);
      setCustomProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, status: 'Delivered', downloadUrl }
            : p
        )
      );
    } catch (error) {
      console.error('Error approving delivery:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'custom-inbox':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Custom Project Requests</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {customProjects
                .filter(p => p.status === 'Pending')
                .map(project => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {project.domain}
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${project.budget}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedCustomProject(project);
                          setShowAssignModal(true);
                        }}
                        leftIcon={<Users className="h-4 w-4" />}
                      >
                        Assign Developer
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'developer-matching':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Developer Matching</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {customProjects
                .filter(p => p.status === 'Assigned' || p.status === 'InProgress')
                .map(project => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Assigned to: {project.seller?.name}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        leftIcon={<MessageSquare className="h-4 w-4" />}
                      >
                        Contact Developer
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'developer-uploads':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Developer Submissions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {customProjects
                .filter(p => p.status === 'Submitted')
                .map(project => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Submitted by: {project.seller?.name}
                        </p>
                        <div className="mt-2 space-x-2">
                          {project.submissionFiles?.map((file, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Download Files
                        </Button>
                        <Button
                          onClick={() => handleApproveDelivery(project.id)}
                          leftIcon={<CheckCircle className="h-4 w-4" />}
                        >
                          Approve & Deliver
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'buyer-deliverables':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Delivered Projects</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {customProjects
                .filter(p => p.status === 'Delivered')
                .map(project => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Delivered to: {project.buyer?.name}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivered on: {new Date(project.deliveryDate!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow">
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
        );
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
                <p className="text-sm font-medium text-gray-500">Custom Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customProjects.filter(p => p.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {customProjects.filter(p => p.status === 'InProgress').length}
                </p>
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

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'projects'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Reviews
            </button>
            <button
              onClick={() => setActiveTab('custom-inbox')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'custom-inbox'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Inbox
            </button>
            <button
              onClick={() => setActiveTab('developer-matching')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'developer-matching'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Developer Matching
            </button>
            <button
              onClick={() => setActiveTab('developer-uploads')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'developer-uploads'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Developer Uploads
            </button>
            <button
              onClick={() => setActiveTab('buyer-deliverables')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'buyer-deliverables'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Buyer Deliverables
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

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

        {/* Assign Developer Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Assign Developer
                    </h3>
                    <div className="mt-2">
                      <select
                        value={selectedSeller}
                        onChange={(e) => setSelectedSeller(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a developer</option>
                        {sellers.map(seller => (
                          <option key={seller.id} value={seller.id}>
                            {seller.name} - {seller.rating}⭐ ({seller.completedProjects} projects)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <Button
                    onClick={handleAssignDeveloper}
                    disabled={!selectedSeller}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    Assign
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedCustomProject(null);
                      setSelectedSeller('');
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
