const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let bcrypt_cost = 12;

const userSchema = new Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    group: { type: String, required: true },
    status: { type: Number, required: true },
    email: { type: String, required: true },
    photo: { type: String, required: true },
    favorite: { type: [Number], required: true },
    right: { type: Number, required: true },
    wrong: { type: Number, required: true },
    passwordHash: String,
});

userSchema.statics.hashPassword = (passwordRaw, cb) => {
    if (process.env.NODE_ENV === 'test') {
        bcrypt_cost = 1
    }
    bcrypt.hash(passwordRaw, bcrypt_cost, cb)
};

userSchema.statics.comparePasswordAndHash = (password, passwordHash, cb) => {
    bcrypt.compare(password, passwordHash, cb)
};

const User = mongoose.model('User', userSchema);

module.exports = User;