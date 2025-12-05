const express = require('express');
const { searchDonors, getAvailableBloodGroups , getAvailableLocations , newRequest , submitContactForm ,   countTotalDonors ,
    countRequestFullfiled , getAvailableLocationCount
 } = require('../controller/recipientController');

const router = express.Router();

router.post('/search-donors', searchDonors); 
router.post('/request-blood' , newRequest);
router.post('/contact-form' , submitContactForm);

router.get('/bloodgroup-avail', getAvailableBloodGroups);
router.get('/location-avail' , getAvailableLocations);

router.get('/total-donor' , countTotalDonors);
router.get('/request-fullfiled' , countRequestFullfiled);
router.get('/cities-covered' , getAvailableLocationCount);

module.exports = router;