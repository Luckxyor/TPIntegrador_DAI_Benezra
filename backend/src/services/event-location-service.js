import EventLocationRepository from '../repositories/event-location-repository.js';
import ValidacionesHelper from '../helpers/validaciones-helper.js';

export default class EventLocationService {
    constructor() {
        this.repository = new EventLocationRepository();
    }
    
    // Obtener todas las event_locations del usuario
    async obtenerEventLocationsPorUsuario(idUsuario, limit = 10, offset = 0) {
        try {
            const resultado = await this.repository.obtenerEventLocationsPorUsuario(idUsuario, limit, offset);
            
            return {
                success: true,
                collection: resultado.eventLocations,
                pagination: resultado.pagination
            };
            
        } catch (error) {
            console.log('Error en servicio al obtener event locations:', error.message);
            return {
                success: false,
                message: 'Error interno del servidor.'
            };
        }
    }
    
    // Obtener una event_location específica
    async obtenerEventLocationPorId(idEventLocation, idUsuario) {
        try {
            const eventLocation = await this.repository.obtenerEventLocationPorId(idEventLocation, idUsuario);
            
            if (!eventLocation) {
                return {
                    exito: false,
                    mensaje: 'La ubicación del evento no existe o no tienes permisos para verla.',
                    codigo: 404
                };
            }
            
            return {
                exito: true,
                eventLocation: eventLocation,
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio al obtener event location:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Crear nueva event_location
    async crearEventLocation(datosEventLocation, idUsuario) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosEventLocation(datosEventLocation);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar que la location base existe
            const locationExiste = await this.repository.verificarLocationExiste(datosEventLocation.id_location);
            if (!locationExiste) {
                return {
                    exito: false,
                    mensaje: 'La ubicación base especificada no existe.',
                    codigo: 400
                };
            }
            
            // Agregar el ID del usuario creador
            datosEventLocation.id_creator_user = idUsuario;
            
            // Crear la event_location
            const nuevaEventLocation = await this.repository.crearEventLocation(datosEventLocation);
            if (!nuevaEventLocation) {
                return {
                    exito: false,
                    mensaje: 'Error al crear la ubicación del evento.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                eventLocation: nuevaEventLocation,
                codigo: 201
            };
            
        } catch (error) {
            console.log('Error en servicio de crear event location:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Actualizar event_location
    async actualizarEventLocation(datosEventLocation, idUsuario) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosEventLocation(datosEventLocation);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar que la event_location existe y pertenece al usuario
            const esPropietario = await this.repository.verificarPropietarioEventLocation(datosEventLocation.id, idUsuario);
            if (!esPropietario) {
                return {
                    exito: false,
                    mensaje: 'La ubicación del evento no existe o no tienes permisos para modificarla.',
                    codigo: 404
                };
            }
            
            // Verificar que la location base existe
            const locationExiste = await this.repository.verificarLocationExiste(datosEventLocation.id_location);
            if (!locationExiste) {
                return {
                    exito: false,
                    mensaje: 'La ubicación base especificada no existe.',
                    codigo: 400
                };
            }
            
            // Agregar el ID del usuario para la verificación
            datosEventLocation.id_creator_user = idUsuario;
            
            // Actualizar la event_location
            const eventLocationActualizada = await this.repository.actualizarEventLocation(datosEventLocation);
            if (!eventLocationActualizada) {
                return {
                    exito: false,
                    mensaje: 'Error al actualizar la ubicación del evento.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                eventLocation: eventLocationActualizada,
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de actualizar event location:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Eliminar event_location
    async eliminarEventLocation(idEventLocation, idUsuario) {
        try {
            // Verificar que la event_location existe y pertenece al usuario
            const esPropietario = await this.repository.verificarPropietarioEventLocation(idEventLocation, idUsuario);
            if (!esPropietario) {
                return {
                    exito: false,
                    mensaje: 'La ubicación del evento no existe o no tienes permisos para eliminarla.',
                    codigo: 404
                };
            }
            
            // Eliminar la event_location
            const resultado = await this.repository.eliminarEventLocation(idEventLocation, idUsuario);
            
            if (resultado === null) {
                return {
                    exito: false,
                    mensaje: 'Error al eliminar la ubicación del evento.',
                    codigo: 500
                };
            }
            
            if (resultado.error) {
                return {
                    exito: false,
                    mensaje: resultado.error,
                    codigo: 400
                };
            }
            
            return {
                exito: true,
                mensaje: 'Ubicación del evento eliminada exitosamente.',
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de eliminar event location:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
}
