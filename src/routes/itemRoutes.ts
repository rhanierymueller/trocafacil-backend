import express from 'express';
import { createItemController, getItemsByUserController, getAllItemsController, getItemByIdController } from '../controllers/itemController';

const router = express.Router();

router.post('/create', createItemController as any);
router.get('/user/:userId', getItemsByUserController as any);
router.get('/', getAllItemsController as any);
router.get('/:id', getItemByIdController as any);

export default router;
