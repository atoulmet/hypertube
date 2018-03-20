'use strict'

import Mongoose from 'mongoose'
import UserSchema from '../schemas/UserSchema'

UserSchema.methods.signup = function (email, username, password) {
    this.default.model.set('password', password)
}

UserSchema.query.byMail = function (email) {
    return this.findOne({ email: new RegExp(email, 'i') })
}

UserSchema.query.byUsername = function (username) {
    return this.findOne({ username: new RegExp(username, 'i') })
}

export default Mongoose.model('User', UserSchema)
