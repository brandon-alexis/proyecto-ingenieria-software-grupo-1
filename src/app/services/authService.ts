import { User, RegisterData, LoginData, UserRole } from '../types/user';

const USERS_KEY = 'bus_tracker_users';
const CURRENT_USER_KEY = 'bus_tracker_current_user';

// Simulated database of users
export const authService = {
  // Register new user
  register: (data: RegisterData, role: UserRole = 'passenger'): User | null => {
    const users = authService.getAllUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Store password separately (in a real app, this would be hashed and stored securely)
    const passwords = authService.getPasswords();
    passwords[newUser.id] = data.password;
    localStorage.setItem('bus_tracker_passwords', JSON.stringify(passwords));

    return newUser;
  },

  // Login user
  login: (data: LoginData): User | null => {
    const users = authService.getAllUsers();
    const passwords = authService.getPasswords();

    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (passwords[user.id] !== data.password) {
      throw new Error('Contraseña incorrecta');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current logged-in user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  // Get all users (admin only)
  getAllUsers: (): User[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  // Get passwords storage
  getPasswords: (): Record<string, string> => {
    const passwordsJson = localStorage.getItem('bus_tracker_passwords');
    return passwordsJson ? JSON.parse(passwordsJson) : {};
  },

  // Initialize with default admin user
  initializeDefaultUsers: (): void => {
    const users = authService.getAllUsers();
    
    if (users.length === 0) {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@bustrack.com',
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
      
      const passwords: Record<string, string> = {
        'admin-1': 'admin123',
      };
      localStorage.setItem('bus_tracker_passwords', JSON.stringify(passwords));
    }
  },

  // Check if user is admin
  isAdmin: (user: User | null): boolean => {
    return user?.role === 'admin';
  },

  // Check if user is passenger
  isPassenger: (user: User | null): boolean => {
    return user?.role === 'passenger';
  },
};
