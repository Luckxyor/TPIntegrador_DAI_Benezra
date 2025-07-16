import EventRepository from '../repositories/event-repository.js'

export default class EventService {
    constructor() {
        this.eventRepository = new EventRepository();
    }

    // Función súper simple para traer TODOS los eventos
    async getAllEvents() {
        try {
            // Traer TODOS los eventos de la base de datos
            const events = await this.eventRepository.getAllEvents();
            return events;
        } catch (error) {
            console.log('Error en service:', error);
            return [];
        }
    }
}
