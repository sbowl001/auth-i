const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.UserSchema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

UserSchema.pre('save', function(next){
    bcrypt.hash(this.password, 11, (err, hash) => {
        if(err) {
            return next(err);
        }
        this.password = hash;
        return next()
    })
})

module.exports = mongoose.model('User', UserSchema, 'users');