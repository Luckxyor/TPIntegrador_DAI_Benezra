import EventRepository from '../repositories/event-repository.js'
import ValidacionesHelper from '../helpers/validaciones-helper.js';

export default class EventService {
    constructor() {
        this.repository = new EventRepository();
    }

    async obtenerEventos(filtros = {}, limite = 10, offset = 0) {
        try {
            const resultado = await this.repository.obtenerTodosLosEventos(filtros, limite, offset);
            
            return {
                collection: resultado.eventos,
                pagination: resultado.pagination
            };
            
        } catch (error) {
            console.log('Error en servicio:', error);
            return {
                message: 'Error interno del servidor.',
                collection: [],
                pagination: {
                    offset: parseInt(offset),
                    limit: parseInt(limite),
                    total: 0
                }
            };
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
            
            const evento = await this.repository.obtenerEventoPorId(idEvento);
            
            if (!evento) {
                return { exito: false, mensaje: 'Evento no encontrado' };
            }
            
            return { exito: true, datos: evento };
            
        } catch (error) {
            console.log('Error en servicio:', error.message);
            return null;
        }
    }
    
    // Crear nuevo evento
    async crearEvento(datosEvento, idUsuario) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosEvento(datosEvento);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar capacidad de la ubicación
            const maxCapacity = await this.repository.verificarCapacidadUbicacion(datosEvento.id_event_location);
            if (maxCapacity === null) {
                return {
                    exito: false,
                    mensaje: 'La ubicación del evento no existe.',
                    codigo: 400
                };
            }
            
            // Validar que max_assistance no exceda la capacidad
            if (datosEvento.max_assistance) {
                const errorCapacidad = ValidacionesHelper.validarCapacidadMaxima(datosEvento.max_assistance, maxCapacity);
                if (errorCapacidad) {
                    return {
                        exito: false,
                        mensaje: errorCapacidad,
                        codigo: 400
                    };
                }
            }
            
            // Agregar el ID del usuario creador
            datosEvento.id_creator_user = idUsuario;
            
            // Crear el evento
            const nuevoEvento = await this.repository.crearEvento(datosEvento);
            if (!nuevoEvento) {
                return {
                    exito: false,
                    mensaje: 'Error al crear el evento.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                evento: nuevoEvento,
                codigo: 201
            };
            
        } catch (error) {
            console.log('Error en servicio de crear evento:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Actualizar evento
    async actualizarEvento(datosEvento, idUsuario) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosEvento(datosEvento);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar que el evento existe y pertenece al usuario
            const esPropietario = await this.repository.verificarPropietarioEvento(datosEvento.id, idUsuario);
            if (!esPropietario) {
                return {
                    exito: false,
                    mensaje: 'El evento no existe o no tienes permisos para modificarlo.',
                    codigo: 404
                };
            }
            
            // Verificar capacidad de la ubicación
            const maxCapacity = await this.repository.verificarCapacidadUbicacion(datosEvento.id_event_location);
            if (maxCapacity === null) {
                return {
                    exito: false,
                    mensaje: 'La ubicación del evento no existe.',
                    codigo: 400
                };
            }
            
            // Validar que max_assistance no exceda la capacidad
            if (datosEvento.max_assistance) {
                const errorCapacidad = ValidacionesHelper.validarCapacidadMaxima(datosEvento.max_assistance, maxCapacity);
                if (errorCapacidad) {
                    return {
                        exito: false,
                        mensaje: errorCapacidad,
                        codigo: 400
                    };
                }
            }
            
            // Agregar el ID del usuario para la verificación
            datosEvento.id_creator_user = idUsuario;
            
            // Actualizar el evento
            const eventoActualizado = await this.repository.actualizarEvento(datosEvento);
            if (!eventoActualizado) {
                return {
                    exito: false,
                    mensaje: 'Error al actualizar el evento.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                evento: eventoActualizado,
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de actualizar evento:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Eliminar evento
    async eliminarEvento(idEvento, idUsuario) {
        try {
            // Verificar que el evento existe y pertenece al usuario
            const esPropietario = await this.repository.verificarPropietarioEvento(idEvento, idUsuario);
            if (!esPropietario) {
                return {
                    exito: false,
                    mensaje: 'El evento no existe o no tienes permisos para eliminarlo.',
                    codigo: 404
                };
            }
            
            // Eliminar el evento
            const resultado = await this.repository.eliminarEvento(idEvento, idUsuario);
            
            if (resultado === null) {
                return {
                    exito: false,
                    mensaje: 'Error al eliminar el evento.',
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
                mensaje: 'Evento eliminado exitosamente.',
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de eliminar evento:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Inscribir usuario a evento
    async inscribirUsuarioAEvento(idEvento, idUsuario) {
        try {
            // Verificar que el evento existe
            const evento = await this.repository.obtenerDatosEventoParaInscripcion(idEvento);
            if (!evento) {
                return {
                    exito: false,
                    mensaje: 'El evento no existe.',
                    codigo: 404
                };
            }
            
            // Validar reglas de inscripción
            const erroresValidacion = ValidacionesHelper.validarInscripcionEvento(evento);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar si el usuario ya está inscrito
            const yaInscrito = await this.repository.verificarInscripcionUsuario(idEvento, idUsuario);
            if (yaInscrito) {
                return {
                    exito: false,
                    mensaje: 'El usuario ya se encuentra registrado en el evento.',
                    codigo: 400
                };
            }
            
            // Verificar capacidad máxima
            const cantidadInscriptos = await this.repository.obtenerCantidadInscriptos(idEvento);
            const errorCapacidad = ValidacionesHelper.validarCapacidadInscriptos(cantidadInscriptos, evento.max_assistance);
            if (errorCapacidad) {
                return {
                    exito: false,
                    mensaje: errorCapacidad,
                    codigo: 400
                };
            }
            
            // Inscribir al usuario
            const inscripcion = await this.repository.inscribirUsuarioAEvento(idEvento, idUsuario);
            if (!inscripcion) {
                return {
                    exito: false,
                    mensaje: 'Error al inscribir al usuario.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                inscripcion: inscripcion,
                codigo: 201
            };
            
        } catch (error) {
            console.log('Error en servicio de inscripción:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Desinscribir usuario de evento
    async desinscribirUsuarioDeEvento(idEvento, idUsuario) {
        try {
            // Verificar que el evento existe
            const evento = await this.repository.obtenerDatosEventoParaInscripcion(idEvento);
            if (!evento) {
                return {
                    exito: false,
                    mensaje: 'El evento no existe.',
                    codigo: 404
                };
            }
            
            // Verificar si el usuario está inscrito
            const estaInscrito = await this.repository.verificarInscripcionUsuario(idEvento, idUsuario);
            if (!estaInscrito) {
                return {
                    exito: false,
                    mensaje: 'El usuario no se encuentra registrado al evento.',
                    codigo: 400
                };
            }
            
            // Validar reglas de desinscripción
            const erroresValidacion = ValidacionesHelper.validarDesinscripcionEvento(evento);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Desinscribir al usuario
            const desinscripcion = await this.repository.desinscribirUsuarioDeEvento(idEvento, idUsuario);
            if (!desinscripcion) {
                return {
                    exito: false,
                    mensaje: 'Error al desinscribir al usuario.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                mensaje: 'Usuario desinscrito exitosamente.',
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de desinscripción:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
}
