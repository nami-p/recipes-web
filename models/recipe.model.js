
const mongoose = require('mongoose');
const Joi = require('joi');

const minimalUserSchema = new mongoose.Schema({
    id:{ type: mongoose.Types.ObjectId, ref: 'user' },
    name: { type: String, required: true, get(v) { return v.toUpperCase() } },
})

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, get(v) { return v.toUpperCase() } },
    description: { type: String, required: true },
    /**/ 
    categorys: [ {type: String, required: true}] ,
    timeInMinutes:{type:Number, required:true},
    layers:[{
        description: { type: String, required: true },
        ingredients:{type :String,required:true}
    }],
    level: { type: number,required:true,min:1,max:5 },
    uploadDate: { type: Date, default: Date.now, immutable: true },
    instructions:{type : String,required:true,minLength:[20 ,'instruction must contain as minimal 20 characters']},
    images:[{type:String,required:false}],
    isPrivate:{type:Boolean,required : false ,default:false},
    //option 1 
    user: [minimalUserSchema]
    //option 2
    //users: [{ type: mongoose.Types.ObjectId, ref: 'users' }] 
 
})



//joi validations
const pattern = /^[A-Za-z\s-,.()!]{4,100}$/;
const namePattern = /^[a-zA-Z\s()]{2,50}$/;

module.exports.validDescription = Joi.object({
    description: Joi.string().pattern(new RegExp(pattern))
});
module.exports.validName = Joi.object({
    description: Joi.string().pattern(new RegExp(namePattern))
});