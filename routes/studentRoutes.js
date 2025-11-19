const express = require('express');
const {
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// CRUD routes:
router.get('/', protect, authorize('admin'), getAllStudents);           // GET all
router.get('/:id', protect, authorize('admin', 'student'), getStudent); // GET one
router.put('/:id', protect, authorize('admin', 'student'), updateStudent); // UPDATE
router.delete('/:id', protect, authorize('admin'), deleteStudent);         // DELETE

module.exports = router;
