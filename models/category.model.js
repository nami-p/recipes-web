
const mongoose = require('mongoose');
const Joi = require('joi');

const minimalRecipeSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, ref: 'recipes', require: true },
  name: { type: String, required: true, get(v) { return v.toUpperCase() } },
  image: { type: String, required: true }
})

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  description: { type: String, required: true },
  recipes: [minimalRecipeSchema]
})



//joi validations
const pattern = /^[A-Za-z\s-,.()!]{4,100}$/;

module.exports.validDescription = Joi.object({
  description: Joi.string().pattern(new RegExp(pattern))
});