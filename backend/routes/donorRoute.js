const express = require('express');
const { updateProfile , getProfile , toggleAvailability , lastDonationDate } = require('../controller/donorController');
const checkToken = require('../middleware/authMiddleware');


const router = express.Router();

router.put('/update-profile' , checkToken , updateProfile);

router.get('/profile' , checkToken ,  getProfile);
router.get('/donation-date' , checkToken , lastDonationDate);

router.patch('/availability' , checkToken , toggleAvailability);

module.exports = router;