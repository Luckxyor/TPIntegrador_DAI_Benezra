import EventService from '../services/event-service.js'

export default class EventController {
    constructor() {
        this.servicioEventos = new EventService();
    }

    // Obtener todos los eventos con filtros
    obtenerTodosLosEventos = async (req, res) => {
        try {
            // Obtener filtros de la URL
            const filtros = {};
            
            if (req.query.name) {
                filtros.nombre = req.query.name.trim();
            }
            
            if (req.query.startdate) {
                filtros.fecha = req.query.startdate.trim();
            }
            
            if (req.query.tag) {
                filtros.tag = req.query.tag.trim();
            }
            
            // Obtener eventos
            const eventos = await this.servicioEventos.obtenerEventos(filtros);
            return res.status(200).json(eventos);
            
        } catch (error) {
            console.log('Error en controlador:', error);
            return res.status(500).json({
                mensaje: 'Error en el servidor'
            });
        }
    }

    // Obtener un evento por ID
    obtenerEventoPorId = async (req, res) => {
        try {
            const { id } = req.params;
            
            const resultado = await this.servicioEventos.obtenerEventoPorId(id);
            
            if (resultado.exito) {
                return res.status(200).json(resultado.datos);
            } else {
                // Si no existe, devolver 404
                if (resultado.mensaje === 'Evento no encontrado') {
                    return res.status(404).json({
                        exito: false,
                        mensaje: resultado.mensaje
                    });
                }
                // Otros errores
                const codigoEstado = resultado.mensaje === 'ID de evento inválido' ? 400 : 500;
                return res.status(codigoEstado).json({
                    exito: false,
                    mensaje: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error en el servidor'
            });
        }
    }
}
