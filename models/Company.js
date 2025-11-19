const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a company name'],
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    website: String,
    location: String,
    description: String,
    hrContact: {
      name: String,
      phone: String,
      email: String,
    },
    internshipOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
      },
    ],
    placementOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Placement',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
