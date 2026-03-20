import axios from "axios";

const API_BASE_URL ="https://municipality-matters.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: {
    username: string;
    nationalId: string;
    password: string;
    role?: string;
  }) => api.post("/auth/register", data),
};

// Properties
export const propertiesApi = {
  getAll: () => api.get("/properties"),
  getById: (id: string) => api.get(`/properties/${id}`),
  getCahier: (id: string) => api.get(`/properties/${id}/cahier`),
  purchaseCahier: (id: string) => api.post(`/properties/${id}/purchase-cahier`),
  getMyPurchases: () => api.get("/properties/my-cahier-purchases"),
  getMyRentals: () => api.get("/properties/my-rentals"),
  payRegistrationFees: (id: string) => api.post(`/properties/${id}/pay-registration-fees`),
  payGuarantees: (id: string) => api.post(`/properties/${id}/pay-guarantees`),
  create: (data: FormData) =>
    api.post("/properties", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/properties/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

// Auctions
export const auctionsApi = {
  getAll: () => api.get("/auctions"),
  getBids: (id: string) => api.get(`/auctions/${id}/bids`),
  create: (data: any) => api.post("/auctions", data),
  placeBid: (id: string, data: { amount: number }) =>
    api.post(`/auctions/${id}/bid`, data),
  close: (id: string) => api.post(`/auctions/${id}/close`),
};

// Invoices
export const invoicesApi = {
  getAll: () => api.get("/invoices"),
  create: (data: { total: number }) => api.post("/invoices", data),
  pay: (data: { invoiceId: string; amount: number }) =>
    api.post("/invoices/pay", data),
};

// Requests
export const requestsApi = {
  getAll: () => api.get("/requests"),
  create: (data: { type: string; description: string }) =>
    api.post("/requests", data),
  approve: (id: string) => api.put(`/requests/${id}/approve`),
  reject: (id: string) => api.put(`/requests/${id}/reject`),
};

// Complaints
export const complaintsApi = {
  getAll: () => api.get("/complaints"),
  create: (data: { description: string }) => api.post("/complaints", data),
  resolve: (id: string) => api.put(`/complaints/${id}/resolve`),
};

// Reviews
export const reviewsApi = {
  getAll: () => api.get("/reviews"),
  create: (data: { content: string }) => api.post("/reviews", data),
  hide: (id: string) => api.put(`/reviews/${id}/hide`),
};

// Announcements
export const announcementsApi = {
  getAll: () => api.get("/announcements"),
  create: (data: { title: string; content: string; language: string }) =>
    api.post("/announcements", data),
  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),
};

// Messages
export const messagesApi = {
  getAll: () => api.get("/messages"),
  send: (data: { receiverId: string; content: string }) =>
    api.post("/messages", data),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
};

// Users/Accounts
export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: {
    username: string;
    nationalId: string;
    password: string;
    role: string;
  }) => api.post("/users", data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Documents
export const documentsApi = {
  getAll: () => api.get("/documents"),
  upload: (data: FormData) =>
    api.post("/documents", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  download: (id: string) => api.get(`/documents/${id}/download`),
  update: (id: string, data: { documentType: string }) =>
    api.put(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Statistics
export const statisticsApi = {
  getAdminStats: () => api.get("/statistics/admin"),
  getEmployeeStats: () => api.get("/statistics/employee"),
  getCitizenStats: () => api.get("/statistics/citizen"),
  getPropertyStats: () => api.get("/statistics/admin"),
  getRecentActivity: (limit: number = 10) =>
    api.get(`/statistics/recent-activity?limit=${limit}`),
};

export default api;
