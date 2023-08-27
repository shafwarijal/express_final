import express from 'express';
import userController from '../controllers/userController.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();

router.post('/', userController.signup);
router.post('/login', userController.signin);
router.post('/changeRole/:id', jwtMiddleware.validateTokenAdmin, userController.changeRole);
router.get('/getUser', jwtMiddleware.validateTokenAdmin, userController.getUser);
router.get('/getUser/:id', jwtMiddleware.validateTokenAdmin, userController.getUserById);
router.get('/myProfile', jwtMiddleware.validateTokenAdmin, userController.getProfile);
router.post('/forgotPassword', userController.requestPasswordReset);
router.post('/resetPassword/:token/:id', userController.resetPassword);

export default router;
