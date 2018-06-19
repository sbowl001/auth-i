const jwt = require('jsonwebtoken');
const SECRET = "These are too many SEcrets";

const makeToken = (user) => {
    const timestamp = new Date().getTime();
    const payload = {
        sub: user._id,
        name: user.username,
        iat: timestamp,
        loggedIn: true,
    }
    const options = {
        expiresIn: '24h'
    }
    return jwt.sign(payload, SECRET, options)
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    //get the Authorization header
    //make sure it exists
    //if it doesnt send error
    if(token === undefined) {
        res.sendStatus(401);
        return
    }
    jwt.verify(token, SECRET, (err, payload) => {
        if(err) {
            res.sendStatus(401).json({msg: "must contain valid token"})
            return
        }
        req.jwtpayload = payload
        next()
    })
    // if it does, decode
    // make sure it decodes
    // pass the decoded payload on the req

}

module.exports = {
    makeToken, 
    verifyToken
}