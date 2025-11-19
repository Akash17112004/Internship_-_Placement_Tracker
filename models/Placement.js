const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'Please provide a position'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    description: String,
    location: String,
    salary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'contract'],
      default: 'full-time',
    },
    requiredSkills: [String],
    eligibility: {
      minGPA: {
        type: Number,
        default: 0,
      },
      allowedDepartments: [String],
    },
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    applicants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'selected'],
          default: 'applied',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    selectedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
