const Student = require('../models/Student');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Placement = require('../models/Placement');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalPlacements = await Placement.countDocuments();

    // Example: Calculate placed students and placement rate (simple)
    const placedStudents = await Student.countDocuments({ 'placedAt.companyId': { $exists: true, $ne: null } });
    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCompanies,
        totalInternships,
        totalPlacements,
        placedStudents,
        placementRate: `${placementRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
