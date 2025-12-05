const express = require('express');
const checkToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/isAdmin');

const { getAllDonors , updateDonorProfile , deleteDonorById } = require ('../../controller/admin/profileController');

const router = express.Router();

router.get('/all-donors', checkToken , isAdmin , getAllDonors);

router.put('/update-donor-profile' , checkToken , isAdmin , updateDonorProfile);

router.delete('/delete-donor' , checkToken , isAdmin , deleteDonorById);

module.exports = router;