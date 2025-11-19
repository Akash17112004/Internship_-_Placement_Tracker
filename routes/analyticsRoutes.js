const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'tpo'), getDashboardStats);

module.exports = router;
