const Student = require('../models/Student');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Placement = require('../models/Placement');

// READ ALL
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'email')
      .populate('appliedInternships.internshipId')
      .populate('appliedPlacements.placementId');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'email')
      .populate('appliedInternships.internshipId')
      .populate('appliedPlacements.placementId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateStudent = async (req, res) => {
  try {
    const { name, rollNo, phoneNumber, department, gpa, resumeUrl, skills } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNo, phoneNumber, department, gpa, resumeUrl, skills },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE (FULL CRUD: D)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await User.findByIdAndDelete(student.userId);

    res.status(200).json({
      success: true,
      message: 'Student and user deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
