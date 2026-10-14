import { Router } from 'express';
import * as ctrl from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBudgetSchema, updateBudgetSchema } from '../schemas/budget.schemas';

const router = Router();

router.use(authenticate);

router.get('/utilization', ctrl.getUtilization);
router.get('/', ctrl.list);
router.post('/', validate(createBudgetSchema), ctrl.create);
router.put('/:id', validate(updateBudgetSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
