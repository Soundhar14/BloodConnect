const express = require('express');
const checkToken = require('../../middleware/authMiddleware');
const isAdmin = require('../../middleware/isAdmin');

const router = express.Router();

const {   getLoginHistory ,  getAllContacts , updateIsReadStatus } = require('../../controller/admin/contactusController');

router.get('/login-sessions' , checkToken , isAdmin , getLoginHistory);
router.get('/contact-form' , checkToken , isAdmin , getAllContacts);

router.patch('/update-contact-msg-read' , checkToken , isAdmin , updateIsReadStatus);

module.exports = router;