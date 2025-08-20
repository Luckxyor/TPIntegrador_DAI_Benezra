import apiService from './api';

class EventLocationService {
  async getEventLocations() {
    try {
      const response = await apiService.get('/event-location');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ubicaciones');
    }
  }

  async getEventLocationById(id) {
    try {
      const response = await apiService.get(`/event-location/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ubicación');
    }
  }

  async createEventLocation(locationData) {
    try {
      const response = await apiService.post('/event-location', locationData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear ubicación');
    }
  }

  async updateEventLocation(id, locationData) {
    try {
      const response = await apiService.put(`/event-location/${id}`, locationData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar ubicación');
    }
  }

  async deleteEventLocation(id) {
    try {
      const response = await apiService.delete(`/event-location/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar ubicación');
    }
  }
}

export const eventLocationService = new EventLocationService();
