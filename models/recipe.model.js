
const mongoose = require('mongoose');
const Joi = require('joi');

const minimalUserSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId,required: true,  ref: 'user' },
    name: { type: String, required: true, get(v) { return v.toUpperCase() } },
})

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true, get(v) { return v.toUpperCase() } },
    description: { type: String, required: true },
    /**/
    categorys: [{ type: String, required: true }],
    timeInMinutes: { type: Number, required: true },
    layers: [{
        description: { type: String, required: true },
        ingredients: [ { type: String, required: true }],
    }],
    level: { type: Number, required: true, min: 1, max: 5 },
    uploadDate: { type: Date, default: Date.now, immutable: true },
    instructions: { type: String, required: true, minLength: [20, 'instruction must contain as minimal 20 characters'] },
    images: [{ type: String, required: false }],
    isPrivate: { type: Boolean, required: false, default: false },
    //option 1 
    user: minimalUserSchema,
    //option 2
    //users: [{ type: mongoose.Types.ObjectId, ref: 'users' }] 

})



//joi validations
const pattern = /^[A-Za-z\u0590-\u05fe\s-,.()!]{4,1000}$/;
const namePattern = /^[a-zA-Z\u0590-\u05fe\s()]{2,100}$/;

module.exports.recipeValidator = {
    addNewRecipe: Joi.object().options({ allowUnknown: true }).keys({
        description: Joi.string().pattern(new RegExp(pattern)).required(),
        name: Joi.string().pattern(new RegExp(namePattern)).required(),
        categorys: Joi.array().min(1).required(),
        timeInMinutes: Joi.number().required(),
        layers: Joi.array().min(1).required().items({
            description: Joi.string().pattern(new RegExp(pattern)).required(),
            ingredients: Joi.array().min(1).required().items(Joi.string().required())
        }),
        level: Joi.number().min(1).max(5).required(),
        instructions: Joi.string().min(20),
        isPrivate: Joi.bool(),
        
    })
};

module.exports.recipeSchema = recipeSchema;
module.exports.Recipe = mongoose.model('recipes', recipeSchema);