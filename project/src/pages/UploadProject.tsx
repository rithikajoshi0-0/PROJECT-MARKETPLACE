import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Link as LinkIcon, Tag as TagIcon, DollarSign, Image as ImageIcon, FileUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import Button from '../components/Button';

const UploadProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFilesRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [''],
    github_link: '',
    image: '',
    price: 0,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData((prev) => ({ ...prev, tags: newTags.length ? newTags : [''] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleProjectFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProjectFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    // Basic validation
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.description.trim()) return setError('Description is required');
    if (!formData.tags[0].trim()) return setError('At least one tag is required');
    if (uploadMethod === 'url' && !formData.image.trim()) return setError('Project image URL is required');
    if (uploadMethod === 'file' && !selectedFile) return setError('Project image file is required');
    if (projectFiles.length === 0) return setError('Project files are required');

    // Filter out empty tags
    const filteredTags = formData.tags.filter((tag) => tag.trim());

    setLoading(true);
    try {
      // If using file upload, first upload the image
      let imageUrl = formData.image;
      if (uploadMethod === 'file' && selectedFile) {
        // In a real app, you would upload the file to your storage service here
        imageUrl = URL.createObjectURL(selectedFile);
      }

      const project = await api.createProject({
        ...formData,
        image: imageUrl,
        tags: filteredTags,
        user_id: user.id,
        files: projectFiles,
      });

      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to upload project');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in or not a seller
  if (user && user.role !== 'Seller') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Only sellers can upload projects. Please switch to a seller account to continue.
            </p>
            <Button onClick={() => navigate('/')}>Back to Marketplace</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload a New Project</h1>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="E.g., E-commerce Platform"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Describe your project in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <TagIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagChange(index, e.target.value)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="E.g., React, Node.js, MongoDB"
                        />
                      </div>
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="github_link" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository URL (optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="url"
                    id="github_link"
                    name="github_link"
                    value={formData.github_link}
                    onChange={handleChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image
                </label>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        uploadMethod === 'url'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        uploadMethod === 'file'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>

                  {uploadMethod === 'url' ? (
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span onClick={() => fileInputRef.current?.click()}>Upload a file</span>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          {selectedFile && (
                            <p className="text-sm text-gray-600 mt-2">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended image size: 1280x720 pixels
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Files
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    ref={projectFilesRef}
                    onChange={handleProjectFilesChange}
                    className="hidden"
                    multiple
                  />
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="project-files-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span onClick={() => projectFilesRef.current?.click()}>Upload project files</span>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">ZIP files up to 100MB</p>
                      {projectFiles.length > 0 && (
                        <div className="text-sm text-gray-600 mt-2">
                          <p>Selected files:</p>
                          <ul className="list-disc list-inside">
                            {projectFiles.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Set to 0 for free projects
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  leftIcon={<Upload className="h-5 w-5" />}
                >
                  Upload Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProject;