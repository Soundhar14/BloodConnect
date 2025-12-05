const express = require('express');
const checkToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/isAdmin');

const router = express.Router();

const { getAllRequest , updateRequestStatus , getDashboardStats ,  countTotalDonors , countRequestFullfiled , 
        countRequestPending } = require('../../controller/admin/dashboardController');

router.get('/total-donors' , checkToken , isAdmin , countTotalDonors);
router.get('/fullfiled-requests' , checkToken , isAdmin , countRequestFullfiled);
router.get('/pending-request' , checkToken , isAdmin , countRequestPending);
router.get('/dashboard-stat' , checkToken , isAdmin , getDashboardStats);

module.exports = router;