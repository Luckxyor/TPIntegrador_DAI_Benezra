import { Router } from 'express';
import EventController from '../controllers/event-controller.js';
import AutenticacionMiddleware from '../middlewares/autentication-middleware.js';

const router = Router();
const controladorEventos = new EventController();

// GET /api/event/ - Listado de eventos con filtros (sin autenticación)
router.get('/', controladorEventos.obtenerTodosLosEventos);

// GET /api/event/:id - Detalle de un evento específico (sin autenticación)
router.get('/:id', controladorEventos.obtenerEventoPorId);

// POST /api/event/ - Crear evento (requiere autenticación)
router.post('/', AutenticacionMiddleware.verificarToken, controladorEventos.crearEvento);

// PUT /api/event/ - Actualizar evento (requiere autenticación)
router.put('/', AutenticacionMiddleware.verificarToken, controladorEventos.actualizarEvento);

// DELETE /api/event/:id - Eliminar evento (requiere autenticación)
router.delete('/:id', AutenticacionMiddleware.verificarToken, controladorEventos.eliminarEvento);

// POST /api/event/:id/enrollment - Inscribir usuario a evento (requiere autenticación)
router.post('/:id/enrollment', AutenticacionMiddleware.verificarToken, controladorEventos.inscribirUsuarioAEvento);

// DELETE /api/event/:id/enrollment - Desinscribir usuario de evento (requiere autenticación)
router.delete('/:id/enrollment', AutenticacionMiddleware.verificarToken, controladorEventos.desinscribirUsuarioDeEvento);

export default router;
