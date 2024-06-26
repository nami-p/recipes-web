const bcrypt = require('bcrypt');
const joi = require('joi');
const { user, generateToken, userValidators, User } = require("../models/user.model");

exports.signIn = async (req, res, next) => {
    const v = userValidators.login.validate(req.body);
    if (v.error)
        return next({ message: v.error.message });

    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
            if (err)
                return next({ message: err.message })
            if (same) {
                const token = generateToken(user);
                user.password = "****";
                return res.status(201).json({ user, token })
            }
            //if user come  to here it means he knows the email and this line avoid tryings discover the paassword
            return next({ message: 'Auth Failed', status: 401 })

        })
    }
    else {
        return next({ message: 'Auth Failed', status: 401 })
    }
}

exports.signUp = async (req, res, next) => {
    const { userName, email, password, adress } = req.body;
    let role = 'guest'
    if (email === 'adminnnn@gmail.net' && password === '1234Aa')
        role = 'admin';
    else
        role = 'user';

    const v = userValidators.signUp.validate({ userName, email, password, adress, role });
    if (v.error)
        return next({ message: v.error.message });
    else {


        try {
            const user = new User({ userName, email, password, adress, role });
            await user.save();

            const token = generateToken(user);

            user.password = '****';
            return res.status(201).json({ user, token });
        }
        catch (error) {
            return next({ message: error.message, status: 409 })
        }
    }
}

exports.getAllUsers = async (req, res, next) => {

    try {

        let { search } = req.query;
        search ??= '';
        const users = await User.find({ userName: new RegExp(search) })
            .select('-__v');
        return res.status(201).json(users);

    } catch (err) {
        next(err);
    }

}
