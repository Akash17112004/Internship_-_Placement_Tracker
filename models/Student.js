const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    rollNo: {
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    department: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'ME', 'CE'],
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    resumeUrl: String,
    skills: [String],
    appliedInternships: [
      {
        internshipId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Internship',
        },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'accepted'],
          default: 'applied',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    appliedPlacements: [
      {
        placementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Placement',
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
    placedAt: {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      position: String,
      salary: Number,
      placedDate: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
