import apiService from './api';

class AuthService {
  async login(username, password) {
    try {
      const response = await apiService.post('/user/login', {
        username,
        password,
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/user/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.get('/user/profile');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  }
}

export const authService = new AuthService();
