import axios from 'axios';

const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                logoutAndRedirect();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                    refreshToken: refreshToken
                });

                const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

                localStorage.setItem('accessToken', newAccess);
                localStorage.setItem('refreshToken', newRefresh);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);

            } catch (refreshError) {
                logoutAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

function logoutAndRedirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; 
}



export const api = {

    createProduct: async (product) => {
        let response = await apiClient.post("/products", product);
        return response.data; 
    },

    getProducts: async () => {
        let response = await apiClient.get("/products");
        return response.data; 
    },

    getProductById: async (product_id) => {
        let response = await apiClient.get(`/products/${product_id}`);
        return response.data;
        },

    updateProduct: async (product_id, product) => {
        let response = await apiClient.patch(`/products/${product_id}`, product);
        return response.data;
    },

    deleteProduct: async (product_id) => {
        let response = await apiClient.delete(`/products/${product_id}`);
        return response.data;
    },

    createUser: async (user) => {
        let response = await apiClient.post("/users", user);
        return response.data; 
    },
    
    getUsers: async () => {
        let response = await apiClient.get("/users");
        return response.data; 
    },

    getUserById: async (user_id) => {
        let response = await apiClient.get(`/users/${user_id}`);
        return response.data;
    },

    getUserByEmail: async (email) => {
        let response = await apiClient.get(`/users/${email}`);
        return response.data;
    },

    updateUserById: async (user_id, user) => {
        let response = await apiClient.patch(`/users/${user_id}`, user);
        return response.data; 
    },

    deleteUserById: async (user_id) => {
        let response = await apiClient.delete(`/users/${user_id}`);
        return response.data;
    },

    register: async (email, username, password) => {
        let response = await apiClient.post('/auth/register', {email, username, password});
        return response.data;
    },
    
    login: async (email, password) => {
        let response = await apiClient.post('/auth/login', {email, password});
        return response.data; 
    },

    authMe: async () => {
        let response = await apiClient.get('/auth/me');
        return response.data;
    },

    updateRefresh: async (refreshToken) => {
        let response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data; 
    }

}