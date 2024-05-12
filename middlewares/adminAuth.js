exports.adminAuth = (req, res, next) => {
    //auth middleware added the user to the request
    if (req.user.role === "admin") { 
        next();
    } else {
        next({ message: `user are not allowed to get such a data please sighn in as admin`, status: 403 })
    }
}