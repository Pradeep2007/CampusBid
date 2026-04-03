import Item from '../models/Item.js';

export const createItem = async (req, res) => {
  const { title, description, category, startingPrice, endTime } = req.body;

  try {
    console.log("File received from Multer:", req.file);

    const imageUrl = req.file ? req.file.path : 'https://via.placeholder.com/400';

    const item = await Item.create({
      title,
      description,
      category,
      startingPrice,
      currentPrice: startingPrice,
      endTime,
      images: [imageUrl], 
      seller: req.user._id,
      status: 'Active' 
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create Item Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getActiveItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { status: 'Active', endTime: { $gt: new Date() } };

    if (category) {
      query.category = category;
    }

    const items = await Item.find(query)
      .populate('seller', 'name creditScore')
      .sort({ endTime: 1 });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name creditScore email')
      .populate('bids.bidder', 'name');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    let winnerId = null;
    if (item.status === 'Pending_Meetup' && item.bids.length > 0) {
      const highestBid = [...item.bids].sort((a, b) => b.amount - a.amount)[0];
      winnerId = highestBid.bidder._id;
    }

    res.json({ ...item._doc, winner: winnerId });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  const { feedbackType } = req.body; 

  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.feedback.votedUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already provided feedback for this item' });
    }

    const updateQuery = {
      $addToSet: { 'feedback.votedUsers': req.user._id }
    };

    if (feedbackType === 'Too Expensive') {
      updateQuery.$inc = { 'feedback.tooExpensiveCount': 1 };
    } else if (feedbackType === 'Not Needed') {
      updateQuery.$inc = { 'feedback.notNeededCount': 1 };
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
    res.json(updatedItem.feedback);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const items = await Item.find({ 'bids.bidder': req.user._id }).sort({ endTime: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};