import { Router } from 'express';
import * as ctrl from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user.schemas';

const router = Router();

router.use(authenticate);
router.get('/profile', ctrl.getProfile);
router.put('/profile', validate(updateProfileSchema), ctrl.updateProfile);
router.put('/password', validate(changePasswordSchema), ctrl.changePassword);

export default router;
