import pkg from 'pg'
import DBConfig from '../configs/db-config.js'

const { Client } = pkg;

export default class EventRepository {
    
    // Obtener todos los eventos con filtros
    async obtenerTodosLosEventos(filtros = {}) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Query para obtener eventos
            let consulta = `
                select 
                    e.id,
                    e.name,
                    e.description,
                    e.start_date,
                    e.duration_in_minutes,
                    e.price,
                    e.enabled_for_enrollment,
                    e.max_assistance,
                    u.first_name as creator_first_name,
                    u.last_name as creator_last_name,
                    u.username as creator_username,
                    el.name as location_name,
                    el.full_address as location_address,
                    el.max_capacity as location_capacity
                from events e
                left join users u on e.id_creator_user = u.id
                left join event_locations el on e.id_event_location = el.id
                where 1=1
            `;
            
            const valores = [];
            let indiceParametro = 1;
            
            // Filtro por nombre
            if (filtros.nombre) {
                consulta += ` and lower(e.name) like lower($${indiceParametro})`;
                valores.push(`%${filtros.nombre}%`);
                indiceParametro++;
            }
            
            // Filtro por fecha
            if (filtros.fecha) {
                consulta += ` and date(e.start_date) = $${indiceParametro}`;
                valores.push(filtros.fecha);
                indiceParametro++;
            }
            
            // Filtro por tag
            if (filtros.tag) {
                consulta += ` and e.id in (
                    select et.id_event 
                    from event_tags et 
                    join tags t on et.id_tag = t.id 
                    where lower(t.name) like lower($${indiceParametro})
                )`;
                valores.push(`%${filtros.tag}%`);
                indiceParametro++;
            }
            
            consulta += ` order by e.start_date asc`;
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows;
            
        } catch (error) {
            console.log('Error en BD:', error.message);
            return [];
        } finally {
            await cliente.end();
        }
    }

    // Obtener un evento por ID con todos los detalles
    async obtenerEventoPorId(id) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Obtener el evento principal
            const consultaEvento = `
                select 
                    e.id,
                    e.name,
                    e.description,
                    e.id_event_location,
                    e.start_date,
                    e.duration_in_minutes,
                    e.price,
                    e.enabled_for_enrollment,
                    e.max_assistance,
                    e.id_creator_user,
                    
                    -- Info de la ubicación del evento
                    json_build_object(
                        'id', el.id,
                        'id_location', el.id_location,
                        'name', el.name,
                        'full_address', el.full_address,
                        'max_capacity', el.max_capacity,
                        'latitude', el.latitude,
                        'longitude', el.longitude,
                        'id_creator_user', el.id_creator_user,
                        'location', json_build_object(
                            'id', l.id,
                            'name', l.name,
                            'id_province', l.id_province,
                            'latitude', l.latitude,
                            'longitude', l.longitude,
                            'province', json_build_object(
                                'id', p.id,
                                'name', p.name,
                                'full_name', p.full_name,
                                'latitude', p.latitude,
                                'longitude', p.longitude,
                                'display_order', p.display_order
                            )
                        ),
                        'creator_user', json_build_object(
                            'id', u_loc.id,
                            'first_name', u_loc.first_name,
                            'last_name', u_loc.last_name,
                            'username', u_loc.username,
                            'password', '******'
                        )
                    ) as event_location,
                    
                    -- Info del usuario creador
                    json_build_object(
                        'id', u.id,
                        'first_name', u.first_name,
                        'last_name', u.last_name,
                        'username', u.username,
                        'password', '******'
                    ) as creator_user
                    
                from events e
                left join event_locations el on e.id_event_location = el.id
                left join locations l on el.id_location = l.id
                left join provinces p on l.id_province = p.id
                left join users u on e.id_creator_user = u.id
                left join users u_loc on el.id_creator_user = u_loc.id
                where e.id = $1
            `;
            
            const resultadoEvento = await cliente.query(consultaEvento, [id]);
            
            if (resultadoEvento.rows.length === 0) {
                return null; // No existe el evento
            }
            
            const evento = resultadoEvento.rows[0];
            
            // Obtener los tags del evento
            const consultaTags = `
                select t.id, t.name
                from tags t
                join event_tags et on t.id = et.id_tag
                where et.id_event = $1
                order by t.name
            `;
            
            const resultadoTags = await cliente.query(consultaTags, [id]);
            evento.tags = resultadoTags.rows;
            
            return evento;
            
        } catch (error) {
            console.log('Error en BD:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }

    // Crear nuevo evento
    async crearEvento(datosEvento) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Obtener el próximo ID disponible
            const consultaMaxId = `
                select coalesce(max(id), 0) + 1 as next_id
                from events
            `;
            
            const resultadoMaxId = await cliente.query(consultaMaxId);
            const nextId = resultadoMaxId.rows[0].next_id;
            
            const consulta = `
                insert into events (
                    id, name, description, id_event_location, 
                    start_date, duration_in_minutes, price, 
                    enabled_for_enrollment, max_assistance, id_creator_user
                )
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                returning *
            `;
            
            const valores = [
                nextId,
                datosEvento.name,
                datosEvento.description,
                datosEvento.id_event_location,
                datosEvento.start_date,
                datosEvento.duration_in_minutes,
                datosEvento.price,
                datosEvento.enabled_for_enrollment || true,
                datosEvento.max_assistance,
                datosEvento.id_creator_user
            ];
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows[0];
            
        } catch (error) {
            console.log('Error en BD al crear evento:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }

    // Actualizar evento
    async actualizarEvento(datosEvento) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                update events 
                set name = $2, description = $3, id_event_location = $4,
                    start_date = $5, duration_in_minutes = $6, price = $7,
                    enabled_for_enrollment = $8, max_assistance = $9
                where id = $1 and id_creator_user = $10
                returning *
            `;
            
            const valores = [
                datosEvento.id,
                datosEvento.name,
                datosEvento.description,
                datosEvento.id_event_location,
                datosEvento.start_date,
                datosEvento.duration_in_minutes,
                datosEvento.price,
                datosEvento.enabled_for_enrollment,
                datosEvento.max_assistance,
                datosEvento.id_creator_user
            ];
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows[0] || null;
            
        } catch (error) {
            console.log('Error en BD al actualizar evento:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }

    // Eliminar evento
    async eliminarEvento(idEvento, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Verificar si hay usuarios inscritos
            const consultaInscritos = `
                select count(*) as total
                from event_enrollments
                where id_event = $1
            `;
            
            const resultadoInscritos = await cliente.query(consultaInscritos, [idEvento]);
            const totalInscritos = parseInt(resultadoInscritos.rows[0].total);
            
            if (totalInscritos > 0) {
                return { error: 'No se puede eliminar el evento porque tiene usuarios inscritos.' };
            }
            
            // Eliminar el evento solo si pertenece al usuario
            const consulta = `
                delete from events
                where id = $1 and id_creator_user = $2
                returning *
            `;
            
            const resultado = await cliente.query(consulta, [idEvento, idUsuario]);
            
            if (resultado.rows.length === 0) {
                return null; // No existe o no pertenece al usuario
            }
            
            return resultado.rows[0];
            
        } catch (error) {
            console.log('Error en BD al eliminar evento:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }

    // Verificar si un evento pertenece a un usuario
    async verificarPropietarioEvento(idEvento, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select id
                from events
                where id = $1 and id_creator_user = $2
            `;
            
            const resultado = await cliente.query(consulta, [idEvento, idUsuario]);
            return resultado.rows.length > 0;
            
        } catch (error) {
            console.log('Error en BD al verificar propietario:', error.message);
            return false;
        } finally {
            await cliente.end();
        }
    }

    // Verificar capacidad máxima de la ubicación
    async verificarCapacidadUbicacion(idEventLocation) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select max_capacity
                from event_locations
                where id = $1
            `;
            
            const resultado = await cliente.query(consulta, [idEventLocation]);
            
            if (resultado.rows.length === 0) {
                return null; // No existe la ubicación
            }
            
            return resultado.rows[0].max_capacity;
            
        } catch (error) {
            console.log('Error en BD al verificar capacidad:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Inscribir usuario a un evento
    async inscribirUsuarioAEvento(idEvento, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Obtener el próximo ID disponible para la inscripción
            const consultaMaxId = `
                select coalesce(max(id), 0) + 1 as next_id
                from event_enrollments
            `;
            
            const resultadoMaxId = await cliente.query(consultaMaxId);
            const nextId = resultadoMaxId.rows[0].next_id;
            
            const consulta = `
                insert into event_enrollments (
                    id, id_event, id_user, description, 
                    registration_date_time, attended, rating, observations
                )
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning *
            `;
            
            const ahora = new Date();
            const valores = [
                nextId,
                idEvento,
                idUsuario,
                '', // description vacía
                ahora,
                false, // attended por defecto
                null,  // rating por defecto
                ''     // observations por defecto
            ];
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows[0];
            
        } catch (error) {
            console.log('Error en BD al inscribir usuario:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Desinscribir usuario de un evento
    async desinscribirUsuarioDeEvento(idEvento, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                delete from event_enrollments
                where id_event = $1 and id_user = $2
                returning *
            `;
            
            const resultado = await cliente.query(consulta, [idEvento, idUsuario]);
            return resultado.rows[0] || null;
            
        } catch (error) {
            console.log('Error en BD al desinscribir usuario:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Verificar si un usuario ya está inscrito a un evento
    async verificarInscripcionUsuario(idEvento, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select id
                from event_enrollments
                where id_event = $1 and id_user = $2
            `;
            
            const resultado = await cliente.query(consulta, [idEvento, idUsuario]);
            return resultado.rows.length > 0;
            
        } catch (error) {
            console.log('Error en BD al verificar inscripción:', error.message);
            return false;
        } finally {
            await cliente.end();
        }
    }
    
    // Obtener cantidad de inscriptos en un evento
    async obtenerCantidadInscriptos(idEvento) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select count(*) as total
                from event_enrollments
                where id_event = $1
            `;
            
            const resultado = await cliente.query(consulta, [idEvento]);
            return parseInt(resultado.rows[0].total);
            
        } catch (error) {
            console.log('Error en BD al obtener cantidad de inscriptos:', error.message);
            return 0;
        } finally {
            await cliente.end();
        }
    }
    
    // Obtener datos básicos de un evento para validaciones de inscripción
    async obtenerDatosEventoParaInscripcion(idEvento) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select 
                    id,
                    name,
                    start_date,
                    enabled_for_enrollment,
                    max_assistance
                from events
                where id = $1
            `;
            
            const resultado = await cliente.query(consulta, [idEvento]);
            return resultado.rows[0] || null;
            
        } catch (error) {
            console.log('Error en BD al obtener datos del evento:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
}
