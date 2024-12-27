import express from 'express';
import { register, login, updateUser} from '../controllers/authController';

const router = express.Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.put('/update', updateUser as any);


export default router;