const express = require('express');
const { signIn, signUp, getAllUsers } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/signIn', signIn)

router.post('/signUp', signUp)

//admin allowed
router.get('/', auth, getAllUsers);

module.exports = router;