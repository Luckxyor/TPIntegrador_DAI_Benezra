import pkg from 'pg';
import DBConfig from '../configs/db-config.js';

const { Client } = pkg;

export default class EventLocationRepository {
    
    // Obtener todas las event locations del usuario autenticado
    async obtenerEventLocationsPorUsuario(idUsuario, limit = 10, offset = 0) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consultaCount = `
                select count(*) as total
                from event_locations el
                where el.id_creator_user = $1
            `;
            
            const resultadoCount = await cliente.query(consultaCount, [idUsuario]);
            const total = parseInt(resultadoCount.rows[0].total);
            
            const consulta = `
                select 
                    el.id,
                    el.id_location,
                    el.name,
                    el.full_address,
                    el.max_capacity,
                    el.latitude,
                    el.longitude,
                    el.id_creator_user,
                    
                    json_build_object(
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
                    ) as location
                    
                from event_locations el
                left join locations l on el.id_location = l.id
                left join provinces p on l.id_province = p.id
                where el.id_creator_user = $1
                order by el.name asc
                limit $2 offset $3
            `;
            
            const resultado = await cliente.query(consulta, [idUsuario, limit, offset]);
            
            return {
                eventLocations: resultado.rows,
                pagination: {
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    total: total
                }
            };
            
        } catch (error) {
            console.log('Error en BD al obtener event locations:', error.message);
            return {
                eventLocations: [],
                pagination: {
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    total: 0
                }
            };
        } finally {
            await cliente.end();
        }
    }
    
    // Obtener una event location por ID del usuario autenticado
    async obtenerEventLocationPorId(idEventLocation, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select 
                    el.id,
                    el.id_location,
                    el.name,
                    el.full_address,
                    el.max_capacity,
                    el.latitude,
                    el.longitude,
                    el.id_creator_user,
                    
                    json_build_object(
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
                    ) as location
                    
                from event_locations el
                left join locations l on el.id_location = l.id
                left join provinces p on l.id_province = p.id
                where el.id = $1 and el.id_creator_user = $2
            `;
            
            const resultado = await cliente.query(consulta, [idEventLocation, idUsuario]);
            return resultado.rows[0] || null;
            
        } catch (error) {
            console.log('Error en BD al obtener event location por ID:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Crear nueva event location
    async crearEventLocation(datosEventLocation) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Obtener el próximo ID disponible
            const consultaMaxId = `
                select coalesce(max(id), 0) + 1 as next_id
                from event_locations
            `;
            
            const resultadoMaxId = await cliente.query(consultaMaxId);
            const nextId = resultadoMaxId.rows[0].next_id;
            
            const consulta = `
                insert into event_locations (
                    id, id_location, name, full_address, 
                    max_capacity, latitude, longitude, id_creator_user
                )
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning *
            `;
            
            const valores = [
                nextId,
                datosEventLocation.id_location,
                datosEventLocation.name,
                datosEventLocation.full_address,
                datosEventLocation.max_capacity,
                datosEventLocation.latitude,
                datosEventLocation.longitude,
                datosEventLocation.id_creator_user
            ];
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows[0];
            
        } catch (error) {
            console.log('Error en BD al crear event location:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Actualizar event location
    async actualizarEventLocation(datosEventLocation) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                update event_locations 
                set id_location = $2, name = $3, full_address = $4,
                    max_capacity = $5, latitude = $6, longitude = $7
                where id = $1 and id_creator_user = $8
                returning *
            `;
            
            const valores = [
                datosEventLocation.id,
                datosEventLocation.id_location,
                datosEventLocation.name,
                datosEventLocation.full_address,
                datosEventLocation.max_capacity,
                datosEventLocation.latitude,
                datosEventLocation.longitude,
                datosEventLocation.id_creator_user
            ];
            
            const resultado = await cliente.query(consulta, valores);
            return resultado.rows[0] || null;
            
        } catch (error) {
            console.log('Error en BD al actualizar event location:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Eliminar event location
    async eliminarEventLocation(idEventLocation, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            // Verificar si hay eventos asociados
            const consultaEventos = `
                select count(*) as total
                from events
                where id_event_location = $1
            `;
            
            const resultadoEventos = await cliente.query(consultaEventos, [idEventLocation]);
            const totalEventos = parseInt(resultadoEventos.rows[0].total);
            
            if (totalEventos > 0) {
                return { error: 'No se puede eliminar la ubicación porque tiene eventos asociados.' };
            }
            
            // Eliminar la event location solo si pertenece al usuario
            const consulta = `
                delete from event_locations
                where id = $1 and id_creator_user = $2
                returning *
            `;
            
            const resultado = await cliente.query(consulta, [idEventLocation, idUsuario]);
            
            if (resultado.rows.length === 0) {
                return null; // No existe o no pertenece al usuario
            }
            
            return resultado.rows[0];
            
        } catch (error) {
            console.log('Error en BD al eliminar event location:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Verificar si una event location pertenece a un usuario
    async verificarPropietarioEventLocation(idEventLocation, idUsuario) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select id
                from event_locations
                where id = $1 and id_creator_user = $2
            `;
            
            const resultado = await cliente.query(consulta, [idEventLocation, idUsuario]);
            return resultado.rows.length > 0;
            
        } catch (error) {
            console.log('Error en BD al verificar propietario de event location:', error.message);
            return false;
        } finally {
            await cliente.end();
        }
    }
    
    // Verificar si una location base existe
    async verificarLocationExiste(idLocation) {
        const cliente = new Client(DBConfig);
        try {
            await cliente.connect();
            
            const consulta = `
                select id
                from locations
                where id = $1
            `;
            
            const resultado = await cliente.query(consulta, [idLocation]);
            return resultado.rows.length > 0;
            
        } catch (error) {
            console.log('Error en BD al verificar location:', error.message);
            return false;
        } finally {
            await cliente.end();
        }
    }
}
