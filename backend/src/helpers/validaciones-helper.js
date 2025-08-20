export default class ValidacionesHelper {
    
    static validarEmail(email) {
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(email);
    }
    
    static validarNombre(nombre) {
        return nombre && typeof nombre === 'string' && nombre.trim().length >= 3;
    }
    
    static validarContrasena(contrasena) {
        return contrasena && typeof contrasena === 'string' && contrasena.trim().length >= 3;
    }
    
    static validarDatosRegistro(datosUsuario) {
        const errores = [];
        
        if (!this.validarNombre(datosUsuario.first_name)) {
            errores.push('El campo first_name debe tener al menos 3 caracteres.');
        }
        
        if (!this.validarNombre(datosUsuario.last_name)) {
            errores.push('El campo last_name debe tener al menos 3 caracteres.');
        }
        
        // Permitir tanto email como username normal
        if (!datosUsuario.username || typeof datosUsuario.username !== 'string' || datosUsuario.username.trim().length < 3) {
            errores.push('El username debe tener al menos 3 caracteres.');
        }
        
        if (!this.validarContrasena(datosUsuario.password)) {
            errores.push('La contraseña debe tener al menos 3 caracteres.');
        }
        
        return errores;
    }
    
    // Validar datos de login
    static validarDatosLogin(datosLogin) {
        const errores = [];
        
        // Validar username (puede ser email o username normal)
        if (!datosLogin.username || typeof datosLogin.username !== 'string' || datosLogin.username.trim().length < 3) {
            errores.push('El username debe tener al menos 3 caracteres.');
        }
        
        if (!datosLogin.password || datosLogin.password.trim() === '') {
            errores.push('La contraseña es requerida.');
        }
        
        return errores;
    }
    
    // Validar datos de evento
    static validarDatosEvento(datosEvento) {
        const errores = [];
        
        // Validar name
        if (!datosEvento.name || typeof datosEvento.name !== 'string' || datosEvento.name.trim().length < 3) {
            errores.push('El campo name debe tener al menos 3 caracteres.');
        }
        
        // Validar description
        if (!datosEvento.description || typeof datosEvento.description !== 'string' || datosEvento.description.trim().length < 3) {
            errores.push('El campo description debe tener al menos 3 caracteres.');
        }
        
        // Validar price
        if (datosEvento.price !== undefined && datosEvento.price < 0) {
            errores.push('El precio no puede ser menor que cero.');
        }
        
        // Validar duration_in_minutes
        if (datosEvento.duration_in_minutes !== undefined && datosEvento.duration_in_minutes < 0) {
            errores.push('La duración en minutos no puede ser menor que cero.');
        }
        
        // Validar id_event_location
        if (!datosEvento.id_event_location || isNaN(datosEvento.id_event_location)) {
            errores.push('Debe especificar una ubicación válida para el evento.');
        }
        
        // Validar max_assistance
        if (datosEvento.max_assistance !== undefined && datosEvento.max_assistance < 0) {
            errores.push('La asistencia máxima no puede ser menor que cero.');
        }
        
        return errores;
    }
    
    // Validar que max_assistance no exceda max_capacity
    static validarCapacidadMaxima(maxAssistance, maxCapacity) {
        if (maxAssistance > maxCapacity) {
            return 'La asistencia máxima no puede ser mayor que la capacidad máxima de la ubicación.';
        }
        return null;
    }
    
    // Validar inscripción a evento
    static validarInscripcionEvento(evento) {
        const errores = [];
        const ahora = new Date();
        const fechaEvento = new Date(evento.start_date);
        
        // Verificar si el evento está habilitado para inscripción
        if (!evento.enabled_for_enrollment) {
            errores.push('El evento no está habilitado para inscripción.');
        }
        
        // Verificar si el evento ya sucedió o es hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Inicio del día
        
        const fechaEventoSinHora = new Date(fechaEvento);
        fechaEventoSinHora.setHours(0, 0, 0, 0);
        
        if (fechaEventoSinHora <= hoy) {
            errores.push('No se puede inscribir a un evento que ya sucedió o es hoy.');
        }
        
        return errores;
    }
    
    // Validar capacidad máxima de inscriptos
    static validarCapacidadInscriptos(cantidadActual, maxAssistance) {
        if (cantidadActual >= maxAssistance) {
            return 'Se ha excedido la capacidad máxima de registrados al evento.';
        }
        return null;
    }
    
    // Validar desinscripción de evento
    static validarDesinscripcionEvento(evento) {
        const errores = [];
        const fechaEvento = new Date(evento.start_date);
        
        // Verificar si el evento ya sucedió o es hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Inicio del día
        
        const fechaEventoSinHora = new Date(fechaEvento);
        fechaEventoSinHora.setHours(0, 0, 0, 0);
        
        if (fechaEventoSinHora <= hoy) {
            errores.push('No se puede desinscribir de un evento que ya sucedió o es hoy.');
        }
        
        return errores;
    }
    
    // Validar datos de event location
    static validarDatosEventLocation(datosEventLocation) {
        const errores = [];
        
        // Validar name
        if (!datosEventLocation.name || typeof datosEventLocation.name !== 'string' || datosEventLocation.name.trim().length < 3) {
            errores.push('El campo name debe tener al menos 3 caracteres.');
        }
        
        // Validar full_address  
        if (!datosEventLocation.full_address || typeof datosEventLocation.full_address !== 'string' || datosEventLocation.full_address.trim().length < 3) {
            errores.push('El campo full_address debe tener al menos 3 caracteres.');
        }
        
        // Validar max_capacity
        if (datosEventLocation.max_capacity === undefined || datosEventLocation.max_capacity < 1) {
            errores.push('La capacidad máxima debe ser al menos 1.');
        }
        
        // Validar latitude
        if (datosEventLocation.latitude === undefined || isNaN(datosEventLocation.latitude)) {
            errores.push('La latitud debe ser un número válido.');
        }
        
        // Validar longitude
        if (datosEventLocation.longitude === undefined || isNaN(datosEventLocation.longitude)) {
            errores.push('La longitud debe ser un número válido.');
        }
        
        // Validar id_location
        if (!datosEventLocation.id_location || isNaN(datosEventLocation.id_location)) {
            errores.push('Debe especificar una ubicación base válida.');
        }
        
        return errores;
    }
}