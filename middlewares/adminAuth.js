exports.adminAuth = (req, res, next) => {
    //auth middleware added the user to the request
    if (req.user.role === "admin") { 
        next();
    } else {
        next({ message: `user are not allowed to get all the users just adninistrator`, status: 403 })
    }
}