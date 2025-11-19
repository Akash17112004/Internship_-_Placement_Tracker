const express = require('express');
const {
  getAllInternships,
  getInternship,
  createInternship,
  updateInternship,
  updateApplicantStatus,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all internships (with filtering)
router.get('/', protect, getAllInternships);

// GET single internship by ID
router.get('/:id', protect, getInternship);

// CREATE new internship (admin only)
router.post('/', protect, authorize('admin'), createInternship);

// UPDATE internship by ID (admin only)
router.put('/:id', protect, authorize('admin'), updateInternship);

// UPDATE applicant status (admin or TPO)
router.put('/:internshipId/applicants/:studentId/status', protect, authorize('admin', 'tpo'), updateApplicantStatus);

// DELETE internship by ID (admin only)
router.delete('/:id', protect, authorize('admin'), deleteInternship);

module.exports = router;
