const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        // console.log(req.cookie);

        // console.log(req.headers);
        const { authorization } = req.headers; 
        const [, token] = authorization.split(' ');
        // console.log('token', token);

        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; 
        const data = jwt.verify(token, privateKey);
        

        req.user = data; 
        next(); 

    } catch (err) {
        next({ message: err, status: 401 })
    }
}