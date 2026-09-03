import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('speedx_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data and handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear token on 401 if unauthorized
      console.warn('[API 401] Unauthorized access.');
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.data?.token) {
      localStorage.setItem('speedx_auth_token', response.data.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.data?.token) {
      localStorage.setItem('speedx_auth_token', response.data.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('speedx_auth_token');
      }
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('speedx_auth_token');
  },
};

// =============================================================================
// CARS FLEET APIs
// =============================================================================
export const carsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/cars', { params });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  getById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  create: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  update: async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};

// =============================================================================
// RENTAL BOOKINGS APIs
// =============================================================================
export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMy: async () => {
    try {
      const response = await api.get('/bookings/my');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  getAllAdmin: async () => {
    try {
      const response = await api.get('/bookings/admin/all');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  approve: async (id) => {
    const response = await api.put(`/bookings/admin/${id}/approve`);
    return response.data;
  },

  reject: async (id, rejection_reason) => {
    const response = await api.put(`/bookings/admin/${id}/reject`, { rejection_reason });
    return response.data;
  },

  complete: async (id) => {
    const response = await api.put(`/bookings/admin/${id}/complete`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// =============================================================================
// NOTIFICATIONS APIs
// =============================================================================
export const notificationsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// =============================================================================
// ORDERS APIs
// =============================================================================
export const ordersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  getMy: async () => {
    try {
      const response = await api.get('/orders/my');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

// =============================================================================
// PAYMENTS APIs
// =============================================================================
export const paymentsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (err) {
      return null;
    }
  }
};

// =============================================================================
// CUSTOMERS APIs
// =============================================================================
export const customersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  getMe: async () => {
    try {
      const response = await api.get('/customers/me');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  updateMe: async (profileData) => {
    const response = await api.put('/customers/me', profileData);
    return response.data;
  }
};

// =============================================================================
// LEADS & TEST DRIVES APIs
// =============================================================================
export const leadsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/leads');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  create: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}/status`, { status });
    return response.data;
  }
};

export const testDrivesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/test-drives');
      return response.data;
    } catch (err) {
      return null;
    }
  },
  create: async (driveData) => {
    const response = await api.post('/test-drives', driveData);
    return response.data;
  },
  getMy: async () => {
    const response = await api.get('/test-drives/my');
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/test-drives/${id}/status`, { status });
    return response.data;
  }
};

export const servicesAPI = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  book: async (serviceData) => {
    const response = await api.post('/services/bookings', serviceData);
    return response.data;
  }
};

export default api;
