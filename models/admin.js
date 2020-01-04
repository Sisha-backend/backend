const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let bcrypt_cost = 12;

const adminSchema = new Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    status: { type: Number, required: true },
    email: { type: String, required: true },
    photo: { type: String, required: true },
    tests: { type: [Number], required: true },
    passwordHash: String,
});

adminSchema.statics.hashPassword = (passwordRaw, cb) => {
    if (process.env.NODE_ENV === 'test') {
        bcrypt_cost = 1
    }
    bcrypt.hash(passwordRaw, bcrypt_cost, cb)
};

adminSchema.statics.comparePasswordAndHash = (password, passwordHash, cb) => {
    bcrypt.compare(password, passwordHash, cb)
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;