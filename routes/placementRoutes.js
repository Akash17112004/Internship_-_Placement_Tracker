const express = require('express');
const {
  getAllPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  updateApplicantStatus,
  deletePlacement,
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all placements (with filtering)
router.get('/', protect, getAllPlacements);

// GET single placement by ID
router.get('/:id', protect, getPlacement);

// CREATE new placement (admin only)
router.post('/', protect, authorize('admin'), createPlacement);

// UPDATE placement by ID (admin only)
router.put('/:id', protect, authorize('admin'), updatePlacement);

// UPDATE applicant status (admin or TPO)
router.put('/:placementId/applicants/:studentId/status', protect, authorize('admin', 'tpo'), updateApplicantStatus);

// DELETE placement by ID (admin only)
router.delete('/:id', protect, authorize('admin'), deletePlacement);

module.exports = router;
