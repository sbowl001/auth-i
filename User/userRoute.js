const express = require('express');
const router = express.Router();
const User = require('./userModel');

//cors for data meant for browser, like react app, if it has a diff api it allows it to go through

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
router.route("/users")
    .get((req, res) => {
        User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        })
    })



module.exports = router;