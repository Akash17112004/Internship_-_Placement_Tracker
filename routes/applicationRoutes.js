const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Application = require('../models/Application');

// GET all applications (Admin/TPO only)
router.get('/', protect, authorize('admin', 'tpo'), async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('student', 'name email rollNo')
      .populate('internship', 'title company')
      .populate('placement', 'role company');
      
    res.status(200).json({ success: true, data: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Approve Application
router.put('/:id/approve', protect, authorize('admin', 'tpo'), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = 'approved';
    await app.save();
    res.status(200).json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Reject Application
router.put('/:id/reject', protect, authorize('admin', 'tpo'), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = 'rejected';
    await app.save();
    res.status(200).json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;