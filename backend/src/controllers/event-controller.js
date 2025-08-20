import EventService from '../services/event-service.js'
import { Router } from 'express';
import AutenticacionMiddleware from '../middlewares/autentication-middleware.js';

export default class EventController {
    constructor() {
        this.service = new EventService();
    }

    obtenerTodosLosEventos = async (req, res) => {
        try {
            const { limit = 10, offset = 0 } = req.query;
            
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
            
            const resultado = await this.service.obtenerEventos(filtros, limit, offset);
            return res.status(200).json(resultado);
            
        } catch (error) {
            console.log('Error en controlador:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener un evento por ID
    obtenerEventoPorId = async (req, res) => {
        try {
            const { id } = req.params;
            
            const resultado = await this.service.obtenerEventoPorId(id);
            
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
            console.log('Error en controlador:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    
    // POST /api/event/ - Crear evento
    crearEvento = async (req, res) => {
        try {
            const datosEvento = req.body;
            const idUsuario = req.usuario.id; // Del middleware de autenticación
            
            const resultado = await this.service.crearEvento(datosEvento, idUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json(resultado.evento);
            } else {
                return res.status(resultado.codigo).json({
                    error: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de crear evento:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    
    // PUT /api/event/ - Actualizar evento
    actualizarEvento = async (req, res) => {
        try {
            const datosEvento = req.body;
            const idUsuario = req.usuario.id; // Del middleware de autenticación
            
            if (!datosEvento.id) {
                return res.status(400).json({
                    error: 'El ID del evento es requerido para actualizar.'
                });
            }
            
            const resultado = await this.service.actualizarEvento(datosEvento, idUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json(resultado.evento);
            } else {
                return res.status(resultado.codigo).json({
                    error: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de actualizar evento:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    
    // DELETE /api/event/:id - Eliminar evento
    eliminarEvento = async (req, res) => {
        try {
            const idEvento = parseInt(req.params.id);
            const idUsuario = req.usuario.id; // Del middleware de autenticación
            
            if (isNaN(idEvento)) {
                return res.status(400).json({
                    error: 'ID del evento inválido'
                });
            }
            
            const resultado = await this.service.eliminarEvento(idEvento, idUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json({
                    message: resultado.mensaje
                });
            } else {
                return res.status(resultado.codigo).json({
                    error: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de eliminar evento:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    
    // POST /api/event/:id/enrollment - Inscribir usuario a evento
    inscribirUsuarioAEvento = async (req, res) => {
        try {
            const idEvento = parseInt(req.params.id);
            const idUsuario = req.usuario.id; // Del middleware de autenticación
            
            if (isNaN(idEvento)) {
                return res.status(400).json({
                    error: 'ID del evento inválido'
                });
            }
            
            const resultado = await this.service.inscribirUsuarioAEvento(idEvento, idUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json(resultado.inscripcion);
            } else {
                return res.status(resultado.codigo).json({
                    error: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de inscripción:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    
    // DELETE /api/event/:id/enrollment - Desinscribir usuario de evento
    desinscribirUsuarioDeEvento = async (req, res) => {
        try {
            const idEvento = parseInt(req.params.id);
            const idUsuario = req.usuario.id; // Del middleware de autenticación
            
            if (isNaN(idEvento)) {
                return res.status(400).json({
                    error: 'ID del evento inválido'
                });
            }
            
            const resultado = await this.service.desinscribirUsuarioDeEvento(idEvento, idUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json({
                    message: resultado.mensaje
                });
            } else {
                return res.status(resultado.codigo).json({
                    error: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de desinscripción:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
}

export const createEventRoutes = () => {
    const router = Router();
    const controladorEventos = new EventController();

    router.get('/', controladorEventos.obtenerTodosLosEventos);
    router.get('/:id', controladorEventos.obtenerEventoPorId);
    router.post('/', AutenticacionMiddleware.verificarToken, controladorEventos.crearEvento);
    router.put('/', AutenticacionMiddleware.verificarToken, controladorEventos.actualizarEvento);
    router.delete('/:id', AutenticacionMiddleware.verificarToken, controladorEventos.eliminarEvento);
    router.post('/:id/enrollment', AutenticacionMiddleware.verificarToken, controladorEventos.inscribirUsuarioAEvento);
    router.delete('/:id/enrollment', AutenticacionMiddleware.verificarToken, controladorEventos.desinscribirUsuarioDeEvento);

    return router;
};
