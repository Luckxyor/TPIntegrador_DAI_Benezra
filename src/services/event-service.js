import EventRepository from '../repositories/event-repository.js'

export default class EventService {
    constructor() {
        this.repositorioEventos = new EventRepository();
    }

    // Obtener todos los eventos con filtros
    async obtenerEventos(filtros = {}) {
        try {
            const eventos = await this.repositorioEventos.obtenerTodosLosEventos(filtros);
            return eventos;
        } catch (error) {
            console.log('Error en servicio:', error);
            return [];
        }
    }

    // Obtener un evento por ID
    async obtenerEventoPorId(id) {
        try {
            // Verificar que el ID sea válido
            const idEvento = parseInt(id);
            if (isNaN(idEvento) || idEvento <= 0) {
                return { exito: false, mensaje: 'ID de evento inválido' };
            }
            
            const evento = await this.repositorioEventos.obtenerEventoPorId(idEvento);
            
            if (!evento) {
                return { exito: false, mensaje: 'Evento no encontrado' };
            }
            
            return { exito: true, datos: evento };
            
        } catch (error) {
            console.log('Error en servicio:', error);
            return { exito: false, mensaje: 'Error interno del servidor' };
        }
    }
}
