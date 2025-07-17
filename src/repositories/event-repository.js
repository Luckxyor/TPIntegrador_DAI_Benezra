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
}
