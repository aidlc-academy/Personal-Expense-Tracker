import { Router } from 'express';
import * as ctrl from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transaction.schemas';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.list);
router.post('/', validate(createTransactionSchema), ctrl.create);
router.get('/:id', ctrl.getOne);
router.put('/:id', validate(updateTransactionSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
