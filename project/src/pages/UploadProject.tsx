import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Link as LinkIcon, Tag as TagIcon, DollarSign, Image as ImageIcon, FileUp, Github, RefreshCw, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import Button from '../components/Button';
import { Octokit } from '@octokit/rest';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type UploadType = 'Project' | 'Portfolio' | 'PhD Paper';

interface CommonFormData {
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
}

interface ProjectFormData extends CommonFormData {
  github_link: string;
  deliveryTimeline: string;
  demoUrl?: string;
}

interface PortfolioFormData extends CommonFormData {
  developerBio: string;
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  resumeFile?: File;
}

interface PhDFormData extends CommonFormData {
  abstract: string;
  domain: string;
  yearCompleted: number;
  university: string;
  authorName?: string;
  isPeerReviewed: boolean;
  pdfFile?: File;
  previewPages: number[];
}

const UploadProject: React.FC = () => {
  const [uploadType, setUploadType] = useState<UploadType>('Project');
  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: '',
    description: '',
    tags: [''],
    github_link: '',
    image: '',
    price: 0,
    deliveryTimeline: '1-2 weeks',
    demoUrl: ''
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioFormData>({
    title: '',
    description: '',
    tags: [''],
    image: '',
    price: 0,
    developerBio: '',
    skills: [''],
    linkedinUrl: '',
    githubUrl: ''
  });
  const [phdData, setPhdData] = useState<PhDFormData>({
    title: '',
    description: '',
    tags: [''],
    image: '',
    price: 0,
    abstract: '',
    domain: '',
    yearCompleted: new Date().getFullYear(),
    university: '',
    authorName: '',
    isPeerReviewed: false,
    previewPages: [1, 2]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip', '.rar'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.type.includes('pdf')) {
        setPhdData(prev => ({ ...prev, pdfFile: file }));
      } else if (file.type.includes('image')) {
        const imageUrl = URL.createObjectURL(file);
        if (uploadType === 'Project') {
          setProjectData(prev => ({ ...prev, image: imageUrl }));
        } else if (uploadType === 'Portfolio') {
          setPortfolioData(prev => ({ ...prev, image: imageUrl }));
        } else {
          setPhdData(prev => ({ ...prev, image: imageUrl }));
        }
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let uploadData;
      switch (uploadType) {
        case 'Project':
          uploadData = { ...projectData, type: 'project', user_id: user.id };
          break;
        case 'Portfolio':
          uploadData = { ...portfolioData, type: 'portfolio', user_id: user.id };
          break;
        case 'PhD Paper':
          uploadData = { ...phdData, type: 'phd', user_id: user.id };
          break;
      }

      await api.createProject(uploadData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  const renderUploadForm = () => {
    switch (uploadType) {
      case 'Project':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={projectData.title}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
              <div className="mt-1 space-y-2">
                {projectData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...projectData.tags];
                        newTags[index] = e.target.value;
                        setProjectData({ ...projectData, tags: newTags });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {index === projectData.tags.length - 1 && (
                      <Button
                        onClick={() => setProjectData({ ...projectData, tags: [...projectData.tags, ''] })}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={projectData.price}
                onChange={(e) => setProjectData({ ...projectData, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Timeline</label>
              <select
                value={projectData.deliveryTimeline}
                onChange={(e) => setProjectData({ ...projectData, deliveryTimeline: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option>Instant Download</option>
                <option>1-2 weeks</option>
                <option>2-4 weeks</option>
                <option>Custom Timeline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Files</label>
              <div {...getRootProps()} className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input {...getInputProps()} />
                <p className="text-gray-600">Drag and drop your project files here, or click to select files</p>
              </div>
            </div>
          </div>
        );

      case 'Portfolio':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Developer Bio</label>
              <textarea
                value={portfolioData.developerBio}
                onChange={(e) => setPortfolioData({ ...portfolioData, developerBio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <div className="mt-1 space-y-2">
                {portfolioData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...portfolioData.skills];
                        newSkills[index] = e.target.value;
                        setPortfolioData({ ...portfolioData, skills: newSkills });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    {index === portfolioData.skills.length - 1 && (
                      <Button
                        onClick={() => setPortfolioData({ ...portfolioData, skills: [...portfolioData.skills, ''] })}
                        variant="secondary"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                type="url"
                value={portfolioData.linkedinUrl}
                onChange={(e) => setPortfolioData({ ...portfolioData, linkedinUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input
                type="url"
                value={portfolioData.githubUrl}
                onChange={(e) => setPortfolioData({ ...portfolioData, githubUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Resume</label>
              <div {...getRootProps()} className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input {...getInputProps()} />
                <p className="text-gray-600">Upload your resume (PDF format)</p>
              </div>
            </div>
          </div>
        );

      case 'PhD Paper':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={phdData.title}
                onChange={(e) => setPhdData({ ...phdData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Abstract</label>
              <textarea
                value={phdData.abstract}
                onChange={(e) => setPhdData({ ...phdData, abstract: e.target.value })}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                value={phdData.domain}
                onChange={(e) => setPhdData({ ...phdData, domain: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                type="text"
                value={phdData.university}
                onChange={(e) => setPhdData({ ...phdData, university: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year of Completion</label>
              <input
                type="number"
                value={phdData.yearCompleted}
                onChange={(e) => setPhdData({ ...phdData, yearCompleted: Number(e.target.value) })}
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={phdData.isPeerReviewed}
                  onChange={(e) => setPhdData({ ...phdData, isPeerReviewed: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Peer Reviewed</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full PDF</label>
              <div {...getRootProps()} className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input {...getInputProps()} />
                <p className="text-gray-600">Upload your PhD paper (PDF format)</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
              <div className="flex items-center space-x-2">
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as UploadType)}
                  className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="Project">Project</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="PhD Paper">PhD Paper</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderUploadForm()}

              <div className="mt-8">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  leftIcon={<Upload className="h-5 w-5" />}
                >
                  Upload {uploadType}
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
