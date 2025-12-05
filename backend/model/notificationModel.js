const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'resolved'],
    default: 'active',
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
