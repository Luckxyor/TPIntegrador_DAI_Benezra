import pg from 'pg';
import DBConfig from '../configs/db-config.js';

export default class UsuarioRepository {
    
    // Buscar usuario por username (email)
    async buscarUsuarioPorUsername(username) {
        const cliente = new pg.Client(DBConfig);
        
        try {
            await cliente.connect();
            
            const consulta = `
                select id, first_name, last_name, username, password
                from users
                where username = $1
            `;
            
            const resultado = await cliente.query(consulta, [username]);
            
            if (resultado.rows.length === 0) {
                return null;
            }
            
            const usuario = resultado.rows[0];
            return {
                id: usuario.id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                username: usuario.username,
                password: usuario.password
            };
            
        } catch (error) {
            console.log('Error en BD:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Crear nuevo usuario
    async crearUsuario(datosUsuario) {
        const cliente = new pg.Client(DBConfig);
        
        try {
            await cliente.connect();
            
            // NO encriptar la contraseña - usar texto plano
            const contrasenaPlana = datosUsuario.password;
            
            // Obtener el próximo ID disponible
            const consultaMaxId = `
                select coalesce(max(id), 0) + 1 as next_id
                from users
            `;
            
            const resultadoMaxId = await cliente.query(consultaMaxId);
            const nextId = resultadoMaxId.rows[0].next_id;
            
            const consulta = `
                insert into users (id, first_name, last_name, username, password)
                values ($1, $2, $3, $4, $5)
                returning id, first_name, last_name, username
            `;
            
            const valores = [
                nextId,
                datosUsuario.first_name,
                datosUsuario.last_name,
                datosUsuario.username,
                datosUsuario.password
            ];
            
            const resultado = await cliente.query(consulta, valores);
            
            if (resultado.rows.length === 0) {
                return null;
            }
            
            const usuario = resultado.rows[0];
            return {
                id: usuario.id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                username: usuario.username,
                password: null
            };
            
        } catch (error) {
            console.log('Error en BD:', error.message);
            return null;
        } finally {
            await cliente.end();
        }
    }
    
    // Verificar contraseña (sin encriptar)
    async verificarContrasena(contrasenaPlana, contrasenaGuardada) {
        try {
            // Comparación directa sin bcrypt
            return contrasenaPlana === contrasenaGuardada;
        } catch (error) {
            console.log('Error verificando contraseña:', error.message);
            return false;
        }
    }
}
