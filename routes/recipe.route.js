const express = require('express');
const { getAllRecipes,getAllRecipesOfUser ,addRecipe,updateRecipe,deleteRecipe, GetById} = require('../controllers/recipe.controller')
const { auth } = require('../middlewares/auth');
const { adminAuth } = require('../middlewares/adminAuth');
const { userAuth } = require('../middlewares/userAuth');

const router = express.Router();

router.get('/', getAllRecipes);

router.post('/addRecipe',auth,userAuth, addRecipe);

router.get('/getById/:id', GetById);

router.get('/getByUser/:id',auth,userAuth, getAllRecipesOfUser);

router.patch('/updateRecipe/:id',auth,userAuth, updateRecipe);

router.delete('/deleteRecipe/:id',auth,userAuth, deleteRecipe);

module.exports = router;