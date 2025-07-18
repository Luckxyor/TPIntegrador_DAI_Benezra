import EventLocationService from '../services/event-location-service.js';
import { Router } from 'express';
import AutenticacionMiddleware from '../middlewares/autentication-middleware.js';

export default class EventLocationController {
    constructor() {
        this.service = new EventLocationService();
    }
    
    obtenerEventLocations = async (req, res) => {
        try {
            const { limit = 10, offset = 0 } = req.query;
            const idUsuario = req.usuario.id;
            const resultado = await this.service.obtenerEventLocationsPorUsuario(idUsuario, limit, offset);
            
            const statusCode = resultado.success ? 200 : 500;
            return res.status(statusCode).json(resultado);
            
        } catch (error) {
            console.log('Error en controlador al obtener event locations:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
    
    // GET by ID - Obtener una event_location específica
    obtenerEventLocationPorId = async (req, res) => {
        try {
            const idEventLocation = parseInt(req.params.id);
            const idUsuario = req.usuario.id;
            
            if (isNaN(idEventLocation)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de la ubicación del evento debe ser un número válido.'
                });
            }
            
            const resultado = await this.service.obtenerEventLocationPorId(idEventLocation, idUsuario);
            
            return res.status(resultado.codigo).json({
                success: resultado.exito,
                message: resultado.mensaje || '',
                data: resultado.eventLocation
            });
            
        } catch (error) {
            console.log('Error en controlador al obtener event location por ID:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
    
    // POST - Crear nueva event_location
    crearEventLocation = async (req, res) => {
        try {
            const datosEventLocation = req.body;
            const idUsuario = req.usuario.id;
            
            const resultado = await this.service.crearEventLocation(datosEventLocation, idUsuario);
            
            return res.status(resultado.codigo).json({
                success: resultado.exito,
                message: resultado.mensaje || '',
                data: resultado.eventLocation
            });
            
        } catch (error) {
            console.log('Error en controlador al crear event location:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
    
    // PUT - Actualizar event_location
    actualizarEventLocation = async (req, res) => {
        try {
            const idEventLocation = parseInt(req.params.id);
            const datosEventLocation = req.body;
            const idUsuario = req.usuario.id;
            
            if (isNaN(idEventLocation)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de la ubicación del evento debe ser un número válido.'
                });
            }
            
            // Agregar el ID al cuerpo de la request
            datosEventLocation.id = idEventLocation;
            
            const resultado = await this.service.actualizarEventLocation(datosEventLocation, idUsuario);
            
            return res.status(resultado.codigo).json({
                success: resultado.exito,
                message: resultado.mensaje || '',
                data: resultado.eventLocation
            });
            
        } catch (error) {
            console.log('Error en controlador al actualizar event location:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
    
    // DELETE - Eliminar event_location
    eliminarEventLocation = async (req, res) => {
        try {
            const idEventLocation = parseInt(req.params.id);
            const idUsuario = req.usuario.id;
            
            if (isNaN(idEventLocation)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de la ubicación del evento debe ser un número válido.'
                });
            }
            
            const resultado = await this.service.eliminarEventLocation(idEventLocation, idUsuario);
            
            return res.status(resultado.codigo).json({
                success: resultado.exito,
                message: resultado.mensaje || ''
            });
            
        } catch (error) {
            console.log('Error en controlador al eliminar event location:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
}

export const createEventLocationRoutes = () => {
    const router = Router();
    const controller = new EventLocationController();

    router.use(AutenticacionMiddleware.verificarToken);

    router.get('/', controller.obtenerEventLocations);
    router.get('/:id', controller.obtenerEventLocationPorId);
    router.post('/', controller.crearEventLocation);
    router.put('/:id', controller.actualizarEventLocation);
    router.delete('/:id', controller.eliminarEventLocation);

    return router;
};
