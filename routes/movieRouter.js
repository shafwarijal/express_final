import express from 'express';
import movieController from '../controllers/movieController.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';
// import singleUpload from '../utils/multer.mjs';
import singleUpload from '../utils/multerUtil.js';

const router = express.Router();

router.get('/', jwtMiddleware.validateTokenAll, movieController.getMovies);
router.get('/:title', jwtMiddleware.validateTokenAll, movieController.getMovie);
router.post('/', jwtMiddleware.validateTokenAdmin, singleUpload, movieController.createMovie);
router.put('/:id', jwtMiddleware.validateTokenAdmin, singleUpload, movieController.editMovie);
router.delete('/:id', jwtMiddleware.validateTokenAdmin, movieController.deleteMovie);

export default router;
