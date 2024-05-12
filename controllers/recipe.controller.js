
const joi = require('joi');
const mongoose = require('mongoose');
const { recipeValidator, Recipe } = require("../models/recipe.model");
const { User } = require("../models/user.model");


exports.getAllRecipes = async (req, res, next) => {
    // http://localhost:5000/courses?search=ab&page=1&perPage=3
    let { search, page, perPage } = req.query;

    search ??= '';
    page ??= 1;
    perPage ??= 16;

    try {
        const recipes = await Recipe?.find({ name: new RegExp(search), isPrivate: false })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        return res.status(201).json(recipes);
    } catch (error) {
        next(error);
    }
};

exports.addRecipe = async (req, res, next) => {

    const v = recipeValidator.addNewRecipe.validate(req.body);
    if (v.error)
        return next({ message: v.error.message });


    try {

        const r = new Recipe(req.body);
        await r.save();

        return res.status(201).json(r);
    }
    catch (error) {
        next(error);
    }
};

exports.updateRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        const r = await Recipe.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        return res.json(r);
    } catch (error) {
        next(error)
    }
};

exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Recipe.findById(id)))
                return next({ message: 'recipe not found!!!', status: 404 })

            await Recipe.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};

exports.GetById = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else {
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe)
                next({ message: 'recipe not found' });

            return res.status(200).json(recipe);
        }
        catch (error) {
            return next(error);
        }

    }
}
exports.getAllRecipesOfUser = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else {
        try {

            const user = await User.findById(id);
            console.log(user);
            if (!user) {
                return next({ message: 'User not found' });
            }

            const recipes = await Recipe.find({ user: user._id });
            return res.status(200).json(recipes);

        }
        catch (error) {
            return next(error);
        }
        // User.findById(id, { __v: false })
        //     .then(c => {
        //         Recipe.find({ user: c._id }).then(recipes => {
        //             return res.status(200).json(recipes);
        //         }).catch(err => {
        //             next({ message: "any recipe are not found!!", status: 404 })
        //         })
        //     })
        //     .catch(err => {
        //         next({ message: 'user not found', status: 404 })
        //     })
    }
}