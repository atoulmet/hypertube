'use strict'

import { Schema } from 'mongoose'

const UserSchema = new Schema({
    email: {
        lowercase: true,
        match: [ /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/, 'Invalid email format' ],
        maxlength: 128,
        minlength: 4,
        required: [ true, 'You must provide an email to registrate !' ],
        trim: true,
        type: String,
        unique: true
    },
    username: {
        lowercase: true,
        match: [ /^[ a-zA-Z0-9 ]+$/, 'Invalid username format !' ],
        maxlength: 32,
        minlength: 6,
        required: [ true, 'You must provide an username to registrate !' ],
        trim: true,
        type: String,
        unique: true
    },
    password: {
        match: [ /\d+/, 'Invalid password format. Make sure to use at least one digit !' ],
        maxlength: 128,
        minlength: 8,
        required: [ true, 'You must provide a password to registrate !' ],
        type: String
    },
    salt: {
        required: false,
        type: String,
    },
    token: {
        maxlength: 128,
        minlength: 32,
        required: false,
        type: String
    },
    photoURL: {
        default: 'http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png',
        maxlength: 256,
        required: false,
        trim: true,
        type: String
    },
    firstName: {
        lowercase: true,
        maxlength: 32,
        minlength: 2,
        required: [ true, 'You must provide your first name to registrate !' ],
        trim: true,
        type: String
    },
    lastName: {
        lowercase: true,
        maxlength: 32,
        minlength: 2,
        required: [ true, 'You must provide your last name to registrate !' ],
        trim: true,
        type: String
    },
    movies: {
        type: []
    }
})

export default UserSchema
