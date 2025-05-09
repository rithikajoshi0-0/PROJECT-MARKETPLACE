import { createClient } from '@supabase/supabase-js';

// For the MVP we'll use demo credentials
// In a production app, these would come from environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types based on the database schema
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Seller' | 'Buyer';
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_link?: string;
  image: string;
  price: number;
  status: 'Available' | 'Sold';
  user_id: string;
  user?: User;
  files?: string[];
};

export type Purchase = {
  id: string;
  buyer_id: string;
  project_id: string;
  timestamp: string;
  project?: Project;
  buyer?: User;
};

// For the MVP, we'll use mock data to simulate the API
export const mockUsers: User[] = [
  { id: '1', name: 'John Seller', email: 'john@example.com', role: 'Seller' },
  { id: '2', name: 'Jane Buyer', email: 'jane@example.com', role: 'Buyer' },
];

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

// Mock API functions to simulate database interactions
export const api = {
  // Auth functions
  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  signup: async (name: string, email: string, role: 'Seller' | 'Buyer', password: string): Promise<User | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) return null;
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role,
    };
    
    mockUsers.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('currentUser');
  },

  updateUserRole: async (userId: string, newRole: 'Seller' | 'Buyer'): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  },
  
  // Project functions
  getProjects: async (filters?: { tag?: string; minPrice?: number; maxPrice?: number }): Promise<Project[]> => {
    // Simulate API call delay
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
    }
    
    return filtered;
  },
  
  getProject: async (id: string): Promise<Project | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const project = mockProjects.find(p => p.id === id);
    if (!project) return null;
    
    // Attach user data
    const user = mockUsers.find(u => u.id === project.user_id);
    return { ...project, user };
  },
  
  createProject: async (project: Omit<Project, 'id' | 'status' | 'files'> & { files?: File[] }): Promise<Project> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would upload files to storage here
    const fileNames = project.files?.map(file => file.name) || ['project-files.zip'];
    
    const newProject: Project = {
      ...project,
      id: String(mockProjects.length + 1),
      status: 'Available',
      files: fileNames,
    };
    
    mockProjects.push(newProject);
    return newProject;
  },
  
  // Purchase functions
  purchaseProject: async (buyerId: string, projectId: string): Promise<Purchase> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPurchase: Purchase = {
      id: String(mockPurchases.length + 1),
      buyer_id: buyerId,
      project_id: projectId,
      timestamp: new Date().toISOString(),
    };
    
    mockPurchases.push(newPurchase);
    
    // Update project status
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      project.status = 'Sold';
    }
    
    return newPurchase;
  },
  
  getUserPurchases: async (userId: string): Promise<Purchase[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const purchases = mockPurchases.filter(p => p.buyer_id === userId);
    
    // Attach project data
    return purchases.map(purchase => {
      const project = mockProjects.find(p => p.id === purchase.project_id);
      return { ...purchase, project };
    });
  },
  
  getUserProjects: async (userId: string): Promise<Project[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockProjects.filter(p => p.user_id === userId);
  },
  
  hasPurchased: async (userId: string, projectId: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockPurchases.some(p => p.buyer_id === userId && p.project_id === projectId);
  },

  downloadProject: async (projectId: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would generate a download URL or stream the file
    // For the MVP, we'll simulate a download
    const project = mockProjects.find(p => p.id === projectId);
    if (!project?.files?.length) {
      throw new Error('No files available for download');
    }

    // Simulate file download
    const link = document.createElement('a');
    link.href = `data:application/zip;base64,UEsDBAoAAAAAAONjiFQAAAAAAAAAAAAAAAA${projectId}`;
    link.download = project.files[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
