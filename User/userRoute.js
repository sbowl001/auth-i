const express = require('express');
const router = express.Router();
const User = require('./userModel');
const jwt= require('jsonwebtoken');
const { makeToken, verifyToken } = require('./aunthFunctions');

// const session = require('express-session');
// cors for data meant for browser, like react app, if it has a diff api it allows it to go through

// const checkAuthorization = (req, res, next) => {
//     const {session} = req;
//     if(session.isLoggedIn) {
//         return next()
//     } else {
//         res.status(401).json({msg: 'You shall not pass'})
//     }
// }

router.route("/register")
    .post((req, res) => {
        const userInfo = req.body;
        const newUser = new User(userInfo);
        newUser.save()
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
        .select('-password')
        .then( user => {
            user.comparePasswords( password, isMatch => {
                if(isMatch){
                    const token = makeToken(user)
                    // req.session.isLoggedIn = true;
                    res.status(201).json({user, token})
                } else {
                    res.status(401).json({msg: "token not created"})
                }
            })
        })
        .catch( err => res.status(500).json(err))
    })

router.route("/users")
    .get(verifyToken, (req, res) => {
        User.find()
        .populate('-password') //what did this do?
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        })
    })
router.route("/self")
    .get(verifyToken, (req, res) =>{ 
    const {jwtpayload} = req;
    User.findById(jwtpayload.sub) 
    .then( user => {
        res.status(200).json(user)
    })
    .catch(err => res.sendStatus(500))
    })
// Use this endpoint to verify that the password is hashed before it is saved. How?


// router.route("/restricted/*")
//     .get(checkAuthorization, (req, res) => {
//     res.status(200).json({msg: "you are authorized"})
// })

module.exports = router;