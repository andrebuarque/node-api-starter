import express from 'express';
import auth from '../config/auth';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router
  .route('/users')
  .get(auth.authenticate(), UsersController.index)
  .post(UsersController.create);

router.route('/users/authenticate').post(UsersController.authenticate);

export default router;
