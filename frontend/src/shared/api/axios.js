import axios from 'axios';

const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

export const api = {

    createProduct: async (product) => {
        let response = await apiClient.post("/products", product);
        return response.data; 
    },

    getProducts: async () => {
        let response = await apiClient.get("/products");
        return response.data; 
    },

    getProductById: async (id) => {
        let response = await apiClient.get(`/products/${id}`);
        return response.data;
        },

    updateProduct: async (id, product) => {
        let response = await apiClient.patch(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id) => {
        let response = await apiClient.delete(`/products/${id}`);
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

    getUserById: async (id) => {
        let response = await apiClient.get(`/users/${id}`);
        return response.datal;
    },

    getUserByEmail: async (email) => {
        let response = await apiClient.get(`/users/${email}`);
        return response.data;
    },

    updateUserById: async (id, user) => {
        let response = await apiClient.patch(`/users/${id}`, user);
        return response.data; 
    },

    deleteUserById: async (email) => {
        let response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },

    register: async (email, first_name, last_name, password) => {
        let response = await apiClient.post('/auth/register', {email, first_name, last_name, password});
        return response.data;
    },
    
    login: async (email, password) => {
        let response = await apiClient.post('auth/login', {email, password});
        return response.data; 
    },

    authMe: async (email) => {
        let response = await apiClient.get('auth/me', email);
        return response.data;
    },

    updateRefresh: async (refreshToken) => {
        let response = await apiClient.post('auth/refresh', refreshToken);
        return response.data; 
    }

}