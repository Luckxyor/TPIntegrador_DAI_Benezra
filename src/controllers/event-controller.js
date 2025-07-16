import EventService from '../services/event-service.js'

export default class EventController {
    constructor() {
        this.eventService = new EventService();
    }

    // Función súper simple que maneja GET /api/event/ y devuelve TODOS los eventos
    getAllEvents = async (req, res) => {
        try {
            // Llamar al service para traer TODOS los eventos
            const events = await this.eventService.getAllEvents();
            
            // Devolver todos los eventos en formato JSON
            return res.status(200).json(events);
            
        } catch (error) {
            console.log('Error en controller:', error);
            return res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    }
}
