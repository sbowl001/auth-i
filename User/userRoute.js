const express = require('express');
const router = express.Router();
const User = require('./userModel');
const session = require('express-session');
// cors for data meant for browser, like react app, if it has a diff api it allows it to go through

const checkAuthorization = (req, res, next) => {
    const {session} = req;
    if(session.isLoggedIn) {
        return next()
    } else {
        res.status(401).json({msg: 'You shall not pass'})
    }
}

router.route("/register")
    .post((req, res) => {
        const user = new User(req.body)
        user.save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).send(err);
        })
    })
router.route("/login")
    .put((req, res) => {
        if(!req.body.username || !req.body.password) {
            res.sendStatus(400)
        }
        const {username, password} = req.body;
    User.findOne({username})
        .then( user => {
            user.comparePasswords( password, isMatch => {
                if(isMatch){
                    req.session.isLoggedIn = true;
                    res.status(200).json({msg: "Logged In"})
                } else {
                    res.status(401).json({msg: "You shall not pass!"})
                }
            })
        })
        .catch( err => res.status(500).json(err))
    })

router.route("/users")
    .get(checkAuthorization, (req, res) => {
        User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        })
    })

// Use this endpoint to verify that the password is hashed before it is saved. How?


router.route("/restricted")
    .get(checkAuthorization, (req, res) => {
    res.status(200).json({msg: "you are authorized"})
})

module.exports = router;