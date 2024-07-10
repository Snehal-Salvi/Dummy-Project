import express from 'express';
import { signup, signin, forgotPassword, resetPassword, getAllUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/users', verifyToken, getAllUsers);

export default router;
