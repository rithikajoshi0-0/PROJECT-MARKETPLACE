import { createClient } from '@supabase/supabase-js';

// For the MVP we'll use demo credentials
// In a production app, these would come from environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserRole = 'Buyer' | 'Seller' | 'Admin' | 'ProjectAdmin' | 'PortfolioAdmin' | 'PhDAdmin';

export type Domain = {
  name: string;
  codingUsage: 'Very High' | 'High' | 'Moderate' | 'Low';
  category: 'Engineering' | 'Arts & Science';
};

// Types based on the database schema
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectUploads: number;
  projectDeletions: number;
  isPremium: boolean;
  isDeveloper?: boolean;
  isAdmin?: boolean;
  expertise?: string[];
  rating?: number;
  completedProjects?: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_link?: string;
  image: string;
  price: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Available' | 'Sold';
  user_id: string;
  domain: string;
  user?: User;
  files?: string[];
  feedback?: string;
  approvedBy?: string;
  approvedAt?: string;
};

export type CustomProject = {
  id: string;
  title: string;
  description: string;
  buyerId: string;
  sellerId?: string;
  status: 'Pending' | 'Assigned' | 'InProgress' | 'Submitted' | 'Delivered';
  budget: number;
  dueDate?: string;
  domain: string;
  attachments?: string[];
  internalNotes?: string;
  buyer?: User;
  seller?: User;
  submissionFiles?: string[];
  submissionDate?: string;
  reviewNotes?: string;
  deliveryDate?: string;
  downloadUrl?: string;
};

// Mock data
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Project Admin', 
    email: 'project.admin@rise.internal', 
    role: 'ProjectAdmin', 
    projectUploads: 0, 
    projectDeletions: 0, 
    isPremium: true,
    isAdmin: true 
  },
  { 
    id: '2', 
    name: 'Portfolio Admin', 
    email: 'portfolio.admin@rise.internal', 
    role: 'PortfolioAdmin', 
    projectUploads: 0, 
    projectDeletions: 0, 
    isPremium: true,
    isAdmin: true 
  },
  { 
    id: '3', 
    name: 'PhD Admin', 
    email: 'phd.admin@rise.internal', 
    role: 'PhDAdmin', 
    projectUploads: 0, 
    projectDeletions: 0, 
    isPremium: true,
    isAdmin: true 
  },
  { 
    id: '2', 
    name: 'Jane Developer', 
    email: 'jane@example.com', 
    role: 'Seller', 
    projectUploads: 12, 
    projectDeletions: 0, 
    isPremium: true,
    isDeveloper: true,
    expertise: ['React', 'Node.js', 'TypeScript'],
    rating: 4.8,
    completedProjects: 15
  },
  { 
    id: '3', 
    name: 'Bob Buyer', 
    email: 'bob@example.com', 
    role: 'Buyer', 
    projectUploads: 0, 
    projectDeletions: 0, 
    isPremium: false 
  }
];

export const domains: Domain[] = [
  { name: 'Computer Science Engineering (CSE)', codingUsage: 'Very High', category: 'Engineering' },
  { name: 'Information Technology (IT)', codingUsage: 'Very High', category: 'Engineering' },
  { name: 'Computer Engineering', codingUsage: 'Very High', category: 'Engineering' },
  { name: 'Electronics and Communication Engineering (ECE)', codingUsage: 'High', category: 'Engineering' },
  { name: 'Electrical and Electronics Engineering (EEE)', codingUsage: 'High', category: 'Engineering' },
  { name: 'Mechatronics Engineering', codingUsage: 'High', category: 'Engineering' },
  { name: 'Robotics Engineering', codingUsage: 'High', category: 'Engineering' },
  { name: 'Artificial Intelligence & Data Science (AI & DS)', codingUsage: 'Very High', category: 'Engineering' },
  { name: 'Mechanical Engineering', codingUsage: 'Moderate', category: 'Engineering' },
  { name: 'Biomedical Engineering', codingUsage: 'Moderate', category: 'Engineering' },
  { name: 'Aerospace Engineering', codingUsage: 'Moderate', category: 'Engineering' },
  { name: 'B.Sc. Computer Science', codingUsage: 'Very High', category: 'Arts & Science' },
  { name: 'B.Sc. Information Technology (IT)', codingUsage: 'Very High', category: 'Arts & Science' },
  { name: 'BCA (Bachelor of Computer Applications)', codingUsage: 'Very High', category: 'Arts & Science' },
  { name: 'B.Sc. Data Science / AI', codingUsage: 'Very High', category: 'Arts & Science' },
  { name: 'B.Sc. Electronics', codingUsage: 'Moderate', category: 'Arts & Science' },
  { name: 'B.Sc. Mathematics / Statistics', codingUsage: 'Moderate', category: 'Arts & Science' },
  { name: 'B.Sc. Physics', codingUsage: 'Moderate', category: 'Arts & Science' },
  { name: 'B.Sc. Bioinformatics', codingUsage: 'Moderate', category: 'Arts & Science' },
  { name: 'B.Sc. Multimedia / Animation', codingUsage: 'Moderate', category: 'Arts & Science' },
];

// Add mockProjects export
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with React and Node.js',
    tags: ['React', 'Node.js', 'MongoDB'],
    image: 'https://example.com/ecommerce.jpg',
    price: 299,
    status: 'Available',
    user_id: '2',
    domain: 'Web Development'
  },
  {
    id: '2',
    title: 'Machine Learning Model',
    description: 'Sentiment analysis model using Python and TensorFlow',
    tags: ['Python', 'TensorFlow', 'ML'],
    image: 'https://example.com/ml-model.jpg',
    price: 499,
    status: 'Available',
    user_id: '2',
    domain: 'Machine Learning'
  }
];

export const mockCustomProjects: CustomProject[] = [
  {
    id: '1',
    title: 'E-commerce Integration',
    description: 'Need help integrating Stripe payment gateway with existing React application',
    buyerId: '3',
    status: 'Pending',
    budget: 500,
    domain: 'Web Development',
    dueDate: '2024-04-01',
    attachments: ['requirements.pdf'],
    buyer: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '2',
    title: 'Machine Learning Model',
    description: 'Develop a custom ML model for sentiment analysis',
    buyerId: '3',
    sellerId: '2',
    status: 'InProgress',
    budget: 1200,
    domain: 'Machine Learning',
    dueDate: '2024-03-25',
    attachments: ['dataset.csv', 'requirements.doc'],
    buyer: mockUsers.find(u => u.id === '3'),
    seller: mockUsers.find(u => u.id === '2'),
    internalNotes: 'Model training in progress, initial accuracy: 85%'
  }
];

export const api = {
  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for admin logins using internal email patterns
    if (email.endsWith('@rise.internal')) {
      const adminUser = mockUsers.find(u => u.email === email.toLowerCase());
      if (adminUser && password === 'admin123!@#') { // In production, use proper password hashing
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return adminUser;
      }
      return null;
    }
    
    // Regular user login logic remains unchanged
    const demoUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: 'Buyer',
      projectUploads: 0,
      projectDeletions: 0,
      isPremium: false
    };
    
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    return demoUser;
  },
  
  signup: async (name: string, email: string, role: UserRole, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (role === 'Admin') {
      throw new Error('Admin accounts cannot be created through signup');
    }
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) return null;
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role,
      projectUploads: 0,
      projectDeletions: 0,
      isPremium: false,
      isDeveloper: false
    };
    
    mockUsers.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('currentUser');
  },

  updateUserRole: async (userId: string, newRole: UserRole): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  },

  upgradeToPremium: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.isPremium = true;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  },

  getProjects: async (filters?: { tag?: string; minPrice?: number; maxPrice?: number; domain?: string }): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockProjects];
    
    if (filters) {
      if (filters.tag) {
        filtered = filtered.filter(p => p.tags.includes(filters.tag!));
      }
      
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.domain) {
        filtered = filtered.filter(p => p.domain === filters.domain);
      }
    }
    
    return filtered;
  },
  
  getProject: async (id: string): Promise<Project | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockProjects.find(p => p.id === id);
    if (!project) return null;
    const user = mockUsers.find(u => u.id === project.user_id);
    return { ...project, user };
  },
  
  createProject: async (project: Omit<Project, 'id' | 'status' | 'files'> & { files?: File[] }): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === project.user_id);
    if (!user) throw new Error('User not found');

    if (!user.isPremium && user.projectUploads >= 3) {
      throw new Error('Upload limit reached. Upgrade to premium to upload more projects.');
    }

    let imageUrl = project.image;
    if (project.files?.length) {
      imageUrl = URL.createObjectURL(project.files[0]);
    }

    const newProject: Project = {
      ...project,
      id: String(mockProjects.length + 1),
      status: 'Pending',
      files: project.files?.map(f => f.name) || ['project-files.zip'],
    };
    
    mockProjects.push(newProject);
    user.projectUploads++;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return newProject;
  },

  deleteProject: async (projectId: string, userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    if (!user.isPremium && user.projectDeletions >= 3) {
      throw new Error('Deletion limit reached. Upgrade to premium for unlimited deletions.');
    }

    const index = mockProjects.findIndex(p => p.id === projectId && p.user_id === userId);
    if (index === -1) throw new Error('Project not found');

    mockProjects.splice(index, 1);
    user.projectDeletions++;
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  approveProject: async (projectId: string, adminId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Approved';
      project.approvedBy = adminId;
      project.approvedAt = new Date().toISOString();
    }
  },

  rejectProject: async (projectId: string, feedback: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Rejected';
      project.feedback = feedback;
    }
  },

  getCustomProjects: async (): Promise<CustomProject[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCustomProjects;
  },

  assignCustomProject: async (projectId: string, sellerId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockCustomProjects.find(p => p.id === projectId);
    if (project) {
      project.sellerId = sellerId;
      project.status = 'Assigned';
      project.seller = mockUsers.find(u => u.id === sellerId);
    }
  },

  submitCustomProject: async (projectId: string, files: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockCustomProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Submitted';
      project.submissionFiles = files;
      project.submissionDate = new Date().toISOString();
    }
  },

  approveCustomProject: async (projectId: string, downloadUrl: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockCustomProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Delivered';
      project.downloadUrl = downloadUrl;
      project.deliveryDate = new Date().toISOString();
    }
  },

  getAvailableSellers: async (domain: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.filter(u => 
      u.role === 'Seller' && 
      u.isDeveloper && 
      (!domain || u.expertise?.includes(domain))
    );
  }
};
