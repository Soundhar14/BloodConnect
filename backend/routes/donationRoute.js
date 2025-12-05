const express = require('express');
const checkToken = require('../middleware/authMiddleware');

const {getDonations , addDonation , updateDonation } = require('../controller/donationController');

const router = express.Router();

router.get('/', checkToken , getDonations);

router.post('/', checkToken , addDonation);

router.put('/:id', checkToken , updateDonation);


module.exports = router;