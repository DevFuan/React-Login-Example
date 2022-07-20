const { User } = require('../models/User')
const { FindbyToken } = require('../database/testDAO')

let auth = (req, res, next) => {

    // get clinet cookie
    let token = req.cookies.x_auth;

    if(!token){
        return res.json({ isAuth: false, error: true })
    }

    // token decoding
    FindbyToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        console.log('user : ' + user.name)

        req.token = token;
        req.name = user.name;
        req.isAuth = user.isAuth;
        req.email = user.email;
        req.role = user.role;
        req.id = user.id;
        next();
    })
}

module.exports = {auth};