import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use(req => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile")
};

export const workspaceAPI = {
  create: (data) => api.post("/workspaces", data),
  getMyWorkspaces: () => api.get("/workspaces"),
  getAll: () => api.get("/workspaces/all"),
  getDetails: (id) => api.get(`/workspaces/${id}`),
  update: (id, data) => api.patch(`/workspaces/${id}`, data),
  delete: (id) => api.delete(`/workspaces/${id}`),
  getTasks: (id) => api.get(`/workspaces/${id}/tasks`)
};

export const taskAPI = {
  create: (workspaceId, data) => api.post(`/tasks/${workspaceId}`, data),
  getUserTasks: () => api.get("/tasks/my-tasks"),
  getWorkspaceTasks: (workspaceId) =>
    api.get(`/tasks/workspace/${workspaceId}`),
  updateStatus: (taskId, status) =>
    api.patch(`/tasks/${taskId}/status`, { status }),
  update: (taskId, data) => api.patch(`/tasks/${taskId}`, data),
  delete: (taskId) => api.delete(`/tasks/${taskId}`)
};

export const userAPI = {
  search: (query) => api.get(`/auth/search?q=${query}`),
  getAllUsers: () => api.get("/auth/list/all"),
  getProfile: () => api.get("/auth/profile")
};

export default api;
