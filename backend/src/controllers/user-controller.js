import UserService from '../services/user-service.js';
import { Router } from 'express';

export default class UserController {
    constructor() {
        this.service = new UserService();
    }
    
    registrarUsuario = async (req, res) => {
        try {
            const datosUsuario = req.body;
            const resultado = await this.service.registrarUsuario(datosUsuario);
            
            if (resultado.exito) {
                return res.status(resultado.codigo).json({
                    success: true,
                    message: resultado.mensaje,
                    user: resultado.usuario
                });
            } else {
                return res.status(resultado.codigo).json({
                    success: false,
                    message: resultado.mensaje
                });
            }
            
        } catch (error) {
            console.log('Error en controlador de registro:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
    
    loginUsuario = async (req, res) => {
        try {
            const datosLogin = req.body;
            const resultado = await this.service.loginUsuario(datosLogin);
            
            return res.status(resultado.codigo).json({
                success: resultado.exito,
                message: resultado.mensaje,
                token: resultado.token
            });
            
        } catch (error) {
            console.log('Error en controlador de login:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.',
                token: ''
            });
        }
    }
}

export const createUserRoutes = () => {
    const router = Router();
    const userController = new UserController();

    router.post('/register', userController.registrarUsuario);
    router.post('/login', userController.loginUsuario);

    return router;
};
