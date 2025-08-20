import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/user-repository.js';
import ValidacionesHelper from '../helpers/validaciones-helper.js';

export default class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
        this.jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
    }
    
    // Registrar nuevo usuario
    async registrarUsuario(datosUsuario) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosRegistro(datosUsuario);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion.join(' '),
                    codigo: 400
                };
            }
            
            // Verificar si el usuario ya existe
            const usuarioExistente = await this.repository.buscarUsuarioPorUsername(datosUsuario.username);
            if (usuarioExistente) {
                return {
                    exito: false,
                    mensaje: 'El usuario ya existe.',
                    codigo: 400
                };
            }
            
            // Crear el usuario
            const nuevoUsuario = await this.repository.crearUsuario(datosUsuario);
            if (!nuevoUsuario) {
                return {
                    exito: false,
                    mensaje: 'Error al crear el usuario.',
                    codigo: 500
                };
            }
            
            return {
                exito: true,
                mensaje: 'Usuario creado exitosamente.',
                usuario: nuevoUsuario,
                codigo: 201
            };
            
        } catch (error) {
            console.log('Error en servicio de registro:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                codigo: 500
            };
        }
    }
    
    // Login de usuario
    async loginUsuario(datosLogin) {
        try {
            // Validar datos de entrada
            const erroresValidacion = ValidacionesHelper.validarDatosLogin(datosLogin);
            if (erroresValidacion.length > 0) {
                return {
                    exito: false,
                    mensaje: erroresValidacion[0], // Solo el primer error
                    token: '',
                    codigo: 400
                };
            }
            
            // Buscar el usuario
            const usuario = await this.repository.buscarUsuarioPorUsername(datosLogin.username);
            if (!usuario) {
                return {
                    exito: false,
                    mensaje: 'Usuario o clave inválida.',
                    token: '',
                    codigo: 401
                };
            }
            
            // Verificar la contraseña
            const contrasenaValida = await this.repository.verificarContrasena(
                datosLogin.password, 
                usuario.password
            );
            
            if (!contrasenaValida) {
                return {
                    exito: false,
                    mensaje: 'Usuario o clave inválida.',
                    token: '',
                    codigo: 401
                };
            }
            
            // Generar JWT
            const payload = {
                id: usuario.id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                username: usuario.username
            };
            
            const token = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiration });
            
            // Preparar datos del usuario para devolver (sin contraseña)
            const userData = {
                id: usuario.id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                username: usuario.username
            };
            
            return {
                exito: true,
                mensaje: '',
                token: token,
                user: userData,
                codigo: 200
            };
            
        } catch (error) {
            console.log('Error en servicio de login:', error.message);
            return {
                exito: false,
                mensaje: 'Error interno del servidor.',
                token: '',
                codigo: 500
            };
        }
    }
}
