const express = require('express');
const router = express.Router();

const {
  sendEmergencyNotification,
  getUserNotifications,
} = require('../../controller/admin/notificationController');

const checkToken = require('../../middleware/authMiddleware'); 

router.post('/emergency', checkToken , sendEmergencyNotification);

router.get('/get-note', checkToken , getUserNotifications);

module.exports = router;
