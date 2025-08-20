import apiService from './api';

class EventService {
  async getEvents() {
    try {
      const response = await apiService.get('/event');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener eventos');
    }
  }

  async getEventById(id) {
    try {
      const response = await apiService.get(`/event/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener evento');
    }
  }

  async createEvent(eventData) {
    try {
      const response = await apiService.post('/event', eventData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear evento');
    }
  }

  async updateEvent(id, eventData) {
    try {
      const response = await apiService.put(`/event/${id}`, eventData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar evento');
    }
  }

  async deleteEvent(id) {
    try {
      const response = await apiService.delete(`/event/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar evento');
    }
  }

  async enrollInEvent(eventId) {
    try {
      const response = await apiService.post(`/event/${eventId}/enrollment`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al inscribirse al evento');
    }
  }

  async unenrollFromEvent(eventId) {
    try {
      const response = await apiService.delete(`/event/${eventId}/enrollment`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al desinscribirse del evento');
    }
  }
}

export const eventService = new EventService();
