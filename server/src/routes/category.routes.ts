import { Router } from 'express';
import * as ctrl from '../controllers/category.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

export default router;
