import {api} from '../shared/api/axios';

export const loginUser = async (credentials) => {
    const response = await api.login(credentials);
    return response;
}