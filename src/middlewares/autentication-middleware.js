import jwt from 'jsonwebtoken';

export default class AutenticacionMiddleware {
    
    static verificarToken = (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de autorización requerido.'
                });
            }
            
            const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
            
            const jwtSecret = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';
            
            const decoded = jwt.verify(tokenLimpio, jwtSecret);
            
            // Agregar la información del usuario decodificada al request
            req.usuario = decoded;
            
            next();
            
        } catch (error) {
            console.log('Error verificando token:', error.message);
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido.'
                });
            }
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado.'
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
}