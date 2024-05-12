exports.userAuth = ( req, res, next) => {

    //auth middleware added the user to the request
    if (req.user.role === "user" || (alsoForAdmin && req.user.role('admin'))) {
        next();
    } else {
        next({ message: `guests are not allowed you have to sighn in`, status: 403 })
    }
}