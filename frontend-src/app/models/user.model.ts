export interface User {
  id: string;
  userId: string;
  name: string;
  role: 'Admin' | 'General User';
  department: string;
  joinedAt: string;
  avatar: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
