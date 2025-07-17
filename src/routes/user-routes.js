import { Router } from 'express';
import UserController from '../controllers/user-controller.js';

const router = Router();
const userController = new UserController();

// POST /api/user/register
router.post('/register', userController.registrarUsuario);

// POST /api/user/login
router.post('/login', userController.loginUsuario);

export default router;
