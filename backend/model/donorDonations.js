// backend/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  date: {
    type: String, // Storing as string for simplicity, can be Date
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Cancelled'],
    default: 'Pending',
  },

  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
});

module.exports = mongoose.model('Donation', DonationSchema);