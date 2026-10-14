import { Router } from 'express';
import * as ctrl from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/summary', ctrl.summary);
router.get('/monthly', ctrl.monthly);
router.get('/category-spending', ctrl.categorySpending);

export default router;
