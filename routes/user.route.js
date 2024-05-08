const express = require('express');
const { signIn, signUp, getAll } = require('../controllers/user.controller')
// const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/signin', signIn)

router.post('/signup', signUp)

//admin allowed
router.get('/', auth, getAllUsers);

module.exports = router;