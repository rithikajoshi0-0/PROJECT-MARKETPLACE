import { createClient } from '@supabase/supabase-js';

// For the MVP we'll use demo credentials
// In a production app, these would come from environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserRole = 'Buyer' | 'Seller' | 'Admin';

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
  attachments?: string[];
  internalNotes?: string;
};

// Mock data
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'System Admin', 
    email: 'admin@example.com', 
    role: 'Admin', 
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
    isDeveloper: true 
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

export const exchangeRates = {
  USD: 1,
  INR: 100,
  EUR: 0.85,
  GBP: 0.73,
  AUD: 1.35,
  CAD: 1.25,
  SGD: 1.33,
  NZD: 1.45,
};

export const currencySymbols = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  NZD: 'NZ$',
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A fully functional e-commerce platform built with React and Node.js.',
    tags: ['React', 'Node.js', 'MongoDB'],
    github_link: 'https://github.com/example/ecommerce',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    price: 99,
    status: 'Available',
    user_id: '1',
    domain: 'Computer Science Engineering (CSE)',
    files: ['project-files.zip'],
  },
  {
    id: '2',
    title: 'Social Media Dashboard',
    description: 'Monitor your social media presence with this beautiful dashboard.',
    tags: ['React', 'Firebase', 'Chart.js'],
    github_link: 'https://github.com/example/social-dashboard',
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    price: 49,
    status: 'Available',
    user_id: '1',
    domain: 'Information Technology (IT)',
    files: ['dashboard-source.zip'],
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Keep track of your tasks with this beautiful Kanban-style application.',
    tags: ['Vue.js', 'Express', 'PostgreSQL'],
    github_link: 'https://github.com/example/task-app',
    image: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&h=750&w=1260',
    price: 0,
    status: 'Available',
    user_id: '1',
    domain: 'B.Sc. Computer Science',
    files: ['task-app.zip'],
  },
  {
    id: '4',
    title: 'Portfolio Template',
    description: 'A beautiful, customizable portfolio template for developers.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    github_link: 'https://github.com/example/portfolio',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    price: 19,
    status: 'Available',
    user_id: '1',
    domain: 'B.Sc. Information Technology (IT)',
    files: ['portfolio-template.zip'],
  },
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    buyer_id: '2',
    project_id: '3',
    timestamp: new Date().toISOString(),
  },
];

export const mockCustomProjects: CustomProject[] = [
  {
    id: '1',
    title: 'E-commerce Integration',
    description: 'Need help integrating Stripe payment gateway',
    buyerId: '3',
    status: 'Pending',
    budget: 500
  }
];

export const api = {
  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, any email with admin@example.com pattern will be granted admin access
    if (email.toLowerCase().includes('admin@example.com')) {
      const adminUser = mockUsers.find(u => u.role === 'Admin');
      if (adminUser) {
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return adminUser;
      }
    }
    
    // For demo purposes, allow any email/password combination
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

  assignCustomProject: async (projectId: string, sellerId: string, dueDate: string, notes: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockCustomProjects.find(p => p.id === projectId);
    if (project) {
      project.sellerId = sellerId;
      project.status = 'Assigned';
      project.dueDate = dueDate;
      project.internalNotes = notes;
    }
  },
  
  purchaseProject: async (buyerId: string, projectId: string): Promise<Purchase> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPurchase: Purchase = {
      id: String(mockPurchases.length + 1),
      buyer_id: buyerId,
      project_id: projectId,
      timestamp: new Date().toISOString(),
    };
    
    mockPurchases.push(newPurchase);
    
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Sold';
    }
    
    return newPurchase;
  },
  
  getUserPurchases: async (userId: string): Promise<Purchase[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const purchases = mockPurchases.filter(p => p.buyer_id === userId);
    
    return purchases.map(purchase => {
      const project = mockProjects.find(p => p.id === purchase.project_id);
      return { ...purchase, project };
    });
  },
  
  getUserProjects: async (userId: string): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProjects.filter(p => p.user_id === userId);
  },
  
  hasPurchased: async (userId: string, projectId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPurchases.some(p => p.buyer_id === userId && p.project_id === projectId);
  },

  downloadProject: async (projectId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const project = mockProjects.find(p => p.id === projectId);
    if (!project?.files?.length) {
      throw new Error('No files available for download');
    }

    const link = document.createElement('a');
    link.href = `data:application/zip;base64,UEsDBAoAAAAAAONjiFQAAAAAAAAAAAAAAAA${projectId}`;
    link.download = project.files[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
