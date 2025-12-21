import api from "./api";

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: "Admin" | "Employee" | "active"; // Matching backend + legacy
    name: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // API returns flat object: { id, email, name, role, token }
    const response = await api.post<any>("/auth/login", {
      email,
      password,
    });

    // Transform to expected frontend structure
    const data = {
      token: response.data.token,
      user: {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
      },
    };

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data as LoginResponse;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
