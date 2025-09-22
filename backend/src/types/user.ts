export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
