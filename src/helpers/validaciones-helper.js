export default class ValidacionesHelper {
    
    // Validar que el email tenga formato válido
    static validarEmail(email) {
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(email);
    }
    
    // Validar que los nombres tengan al menos 3 caracteres y no estén vacíos
    static validarNombre(nombre) {
        return nombre && typeof nombre === 'string' && nombre.trim().length >= 3;
    }
    
    // Validar que la contraseña tenga al menos 3 caracteres y no esté vacía
    static validarContrasena(contrasena) {
        return contrasena && typeof contrasena === 'string' && contrasena.trim().length >= 3;
    }
    
    // Validar todos los campos de registro
    static validarDatosRegistro(datosUsuario) {
        const errores = [];
        
        if (!this.validarNombre(datosUsuario.first_name)) {
            errores.push('El campo first_name debe tener al menos 3 caracteres.');
        }
        
        if (!this.validarNombre(datosUsuario.last_name)) {
            errores.push('El campo last_name debe tener al menos 3 caracteres.');
        }
        
        if (!this.validarEmail(datosUsuario.username)) {
            errores.push('El email es invalido.');
        }
        
        if (!this.validarContrasena(datosUsuario.password)) {
            errores.push('La contraseña debe tener al menos 3 caracteres.');
        }
        
        return errores;
    }
    
    // Validar datos de login
    static validarDatosLogin(datosLogin) {
        const errores = [];
        
        if (!this.validarEmail(datosLogin.username)) {
            errores.push('El email es invalido.');
        }
        
        if (!datosLogin.password || datosLogin.password.trim() === '') {
            errores.push('La contraseña es requerida.');
        }
        
        return errores;
    }
}