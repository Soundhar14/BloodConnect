const express = require('express');
const checkToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/isAdmin');

const router = express.Router();

const { getAllRequest , updateRequestStatus } = require('../../controller/admin/requestController');

router.get('/all-requests' , checkToken , isAdmin , getAllRequest);

router.patch('/update-request-status' , checkToken , isAdmin , updateRequestStatus);

module.exports = router;