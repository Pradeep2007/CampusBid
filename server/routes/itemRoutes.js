import express from 'express';
import { 
  createItem, 
  getActiveItems, 
  getItemById, 
  submitFeedback, 
  getMyBids, 
  getMyListings 
} from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/cloudinary.js'; 

const router = express.Router();

router.route('/')
  .get(protect, getActiveItems)
  .post(protect, upload.single('image'), createItem);

router.get('/my-bids', protect, getMyBids);
router.get('/my-listings', protect, getMyListings);

router.route('/:id')
  .get(protect, getItemById);

router.post('/:id/feedback', protect, submitFeedback);

export default router;