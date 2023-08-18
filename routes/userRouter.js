import express from 'express';
import userController from '../controllers/userController.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();

router.post('/', userController.signup);
router.post('/login', userController.signin);
router.post('/changeRole/:id', jwtMiddleware.validateTokenAdmin, userController.changeRole);
router.get('/', userController.getUser);
router.post('/forgotPassword', userController.requestPasswordReset);
router.post('/resetPassword/:token/:id', userController.resetPassword);

// router.get('/', userModel.getMovies);
// router.post('/', userModel.signup);
// router.put('/:id', userModel.editMovie);

export default router;
