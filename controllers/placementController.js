const Placement = require('../models/Placement');
const Company = require('../models/Company');

// ADVANCED FILTERING + GET ALL
exports.getAllPlacements = async (req, res) => {
  try {
    const { location, minSalary, maxSalary, minGPA, skills, companyId } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = parseInt(minSalary);
      if (maxSalary) filter.salary.$lte = parseInt(maxSalary);
    }
    if (minGPA) {
      filter['eligibility.minGPA'] = { $lte: parseFloat(minGPA) };
    }
    if (skills) {
      filter.requiredSkills = { $in: skills.split(',') };
    }
    if (companyId) {
      filter.companyId = companyId;
    }

    const placements = await Placement.find(filter)
      .populate('companyId', 'name location')
      .populate('applicants.studentId', 'name email')
      .populate('selectedStudents', 'name email rollNo');

    res.status(200).json({
      success: true,
      count: placements.length,
      data: placements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SINGLE GET
exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('companyId')
      .populate('applicants.studentId', 'name email rollNo gpa')
      .populate('selectedStudents', 'name email rollNo');
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }
    res.status(200).json({ success: true, data: placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createPlacement = async (req, res) => {
  try {
    const { position, companyId, description, location, salary, jobType, requiredSkills, eligibility, applicationDeadline } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    const placement = await Placement.create({
      position,
      companyId,
      description,
      location,
      salary,
      jobType,
      requiredSkills,
      eligibility,
      applicationDeadline,
    });
    company.placementOffers.push(placement._id);
    await company.save();
    res.status(201).json({ success: true, data: placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }
    placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// APPLICANT STATUS UPDATE
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { placementId, studentId } = req.params;
    const { status } = req.body;
    const placement = await Placement.findById(placementId);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }
    const applicant = placement.applicants.find((app) => app.studentId.toString() === studentId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }
    applicant.status = status;
    if (status === 'selected' && !placement.selectedStudents.includes(studentId)) {
      placement.selectedStudents.push(studentId);
    }
    await placement.save();
    res.status(200).json({
      success: true,
      message: 'Applicant status updated',
      data: placement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Placement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
