import { Router } from 'express';
import EventController from '../controllers/event-controller.js'

const router = Router();
const controladorEventos = new EventController();

// GET /api/event/ - Listado de eventos con filtros
router.get('/', controladorEventos.obtenerTodosLosEventos);

// GET /api/event/:id - Detalle de un evento específico
router.get('/:id', controladorEventos.obtenerEventoPorId);

export default router;
