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
    const { userName, email, password, adress, role } = req.body;

    const v = userValidators.signUp.validate(req.body);
    if (v.error)
        return next({ message: v.error.message });
    else {

        if (email === 'adminnnn@gmail.net' && password === '1234')
            role = 'admin';
        else
            role = 'user';

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
        if (id !== updatedUser._id)
            return next({ message: 'user id conflict', status: 409 });

        else
            //auth middleware added the user to the request
            if (req.user.role === "admin") {

                let { search } = req.query;
                search ??= '';
                const users = await User.find({ userName: new RegExp(search) })
                    .select('-__v');
                return res.status(201).json(users);

            } else {
                next({ message: `user are not allowed to get all the users just adninistrator`, status: 403 })
            }

    } catch (err) {
        next(error);
    }

}
