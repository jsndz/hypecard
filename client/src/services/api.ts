const API_BASE_URL = "http://localhost:3001";

// Types
export interface User {
  id: string;
  email: string;
  is_pro: boolean;
  created_at: string;
}

export interface Video {
  id: number;
  user_id: string;
  name: string;
  role?: string;
  tagline: string;
  description: string;
  avatar: string;
  video_url: string;
  tavus_video_id: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
    timestamp: string;
  };
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Try to get token from localStorage on initialization
    this.token = localStorage.getItem("hypecard_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("hypecard_token", token);
    } else {
      localStorage.removeItem("hypecard_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (
        headers as Record<string, string>
      ).Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error.message || "An error occurred");
    }

    return response.json();
  }

  // Authentication endpoints
  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      user: User;
      session: {
        access_token: string;
        refresh_token: string;
        expires_at: number;
      };
    }>
  > {
    const response = await this.request<
      ApiResponse<{
        user: User;
        session: {
          access_token: string;
          refresh_token: string;
          expires_at: number;
        };
      }>
    >("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Set token after successful login
    this.setToken(response.data.session.access_token);
    return response;
  }

  async signup(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      user: User;
      session: {
        access_token: string;
        refresh_token: string;
        expires_at: number;
      };
    }>
  > {
    const response = await this.request<
      ApiResponse<{
        user: User;
        session: {
          access_token: string;
          refresh_token: string;
          expires_at: number;
        };
      }>
    >("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Set token after successful signup
    this.setToken(response.data.session.access_token);
    return response;
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return this.request<ApiResponse<{ user: User }>>("/api/me");
  }

  // Video management endpoints
  async createVideo(formData: {
    formType: "personal" | "business";
    name: string;
    role?: string;
    tagline: string;
    description: string;
    avatar: string;
  }): Promise<
    ApiResponse<{
      id: number;
      video_url: string;
      status: string;
      created_at: string;
    }>
  > {
    return this.request<
      ApiResponse<{
        id: number;
        video_url: string;
        status: string;
        created_at: string;
      }>
    >("/api/form", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  async getVideos(): Promise<
    ApiResponse<{
      videos: Video[];
      count: number;
    }>
  > {
    return this.request<
      ApiResponse<{
        videos: Video[];
        count: number;
      }>
    >("/api/videos");
  }

  async deleteVideo(id: number): Promise<
    ApiResponse<{
      message: string;
    }>
  > {
    return this.request<
      ApiResponse<{
        message: string;
      }>
    >(`/api/videos/${id}`, {
      method: "DELETE",
    });
  }

  // Public card endpoints
  async getCard(id: string): Promise<ApiResponse<Video>> {
    return this.request<ApiResponse<Video>>(`/api/card/${id}`);
  }

  async getCardShare(id: string): Promise<
    ApiResponse<{
      id: number;
      title: string;
      description: string;
      url: string;
      image: string;
    }>
  > {
    return this.request<
      ApiResponse<{
        id: number;
        title: string;
        description: string;
        url: string;
        image: string;
      }>
    >(`/api/card/${id}/share`);
  }

  // Subscription endpoints
  async getSubscriptionStatus(): Promise<
    ApiResponse<{
      is_pro: boolean;
      updated_at: string;
    }>
  > {
    return this.request<
      ApiResponse<{
        is_pro: boolean;
        updated_at: string;
      }>
    >("/api/subscribe/status");
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    return this.request<{
      status: string;
      timestamp: string;
      service: string;
    }>("/health");
  }

  logout() {
    this.setToken(null);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);
