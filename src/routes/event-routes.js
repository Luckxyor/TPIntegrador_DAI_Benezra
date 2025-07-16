import { Router } from 'express';
import EventController from '../controllers/event-controller.js'

const router = Router();
const eventController = new EventController();

// Ruta simple: GET /api/event/
router.get('/', eventController.getAllEvents);

export default router;
