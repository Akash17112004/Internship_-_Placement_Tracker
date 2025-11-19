const Internship = require('../models/Internship');
const Company = require('../models/Company');

// ADVANCED FILTERING + GET ALL
exports.getAllInternships = async (req, res) => {
  try {
    const { location, minSalary, maxSalary, minGPA, skills, companyId } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minSalary || maxSalary) {
      filter.stipend = {};
      if (minSalary) filter.stipend.$gte = parseInt(minSalary);
      if (maxSalary) filter.stipend.$lte = parseInt(maxSalary);
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

    const internships = await Internship.find(filter)
      .populate('companyId', 'name location')
      .populate('applicants.studentId', 'name email')
      .populate('selectedStudents', 'name email rollNo');

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SINGLE GET
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('companyId')
      .populate('applicants.studentId', 'name email rollNo gpa')
      .populate('selectedStudents', 'name email rollNo');
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.createInternship = async (req, res) => {
  try {
    const { position, companyId, description, location, stipend, duration, requiredSkills, eligibility, applicationDeadline } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    const internship = await Internship.create({
      position,
      companyId,
      description,
      location,
      stipend,
      duration,
      requiredSkills,
      eligibility,
      applicationDeadline,
    });
    company.internshipOffers.push(internship._id);
    await company.save();
    res.status(201).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// APPLICANT STATUS UPDATE
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { internshipId, studentId } = req.params;
    const { status } = req.body;
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    const applicant = internship.applicants.find((app) => app.studentId.toString() === studentId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }
    applicant.status = status;
    if (status === 'accepted' && !internship.selectedStudents.includes(studentId)) {
      internship.selectedStudents.push(studentId);
    }
    await internship.save();
    res.status(200).json({
      success: true,
      message: 'Applicant status updated',
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
