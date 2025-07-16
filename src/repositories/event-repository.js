import pkg from 'pg'
import DBConfig from '../configs/db-config.js'

const { Client } = pkg;

export default class EventRepository {
    
    // Función para traer TODOS los eventos de la base de datos (sin paginación)
    async getAllEvents() {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            
            // Query simple que trae TODOS los eventos con información plana
            const sql = `
                SELECT 
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
                FROM events e
                LEFT JOIN users u ON e.id_creator_user = u.id
                LEFT JOIN event_locations el ON e.id_event_location = el.id
                ORDER BY e.start_date ASC
            `;
            
            const result = await client.query(sql);
            return result.rows;
            
        } catch (error) {
            console.log('Error:', error);
            return [];
        } finally {
            await client.end();
        }
    }
}
