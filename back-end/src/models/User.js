const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    status_pagamento: {
        type: Boolean,
        required: true,
    },
    plan: {
        type: String,
        enum: ['inicial', 'popular', 'premium'],
        required: false,
    },
    createAT: {
        type: Date,
        default: Date.now(),
    },
})
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
UserSchema.methods.checkPassword = async function (passwordInserted) {
    return await bcrypt.compare(passwordInserted, this.password);
}
module.exports = mongoose.model('User', UserSchema);