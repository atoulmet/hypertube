'use strict'

import { Schema } from 'mongoose'

const LocalSchema = new Schema({
    title: {
        lowercase: true,
        maxlength: 128,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    magnet: {
        required: true,
        type: String
    },
    movieID: {
        required: true,
        type: String
    },
    path: {
        maxlength: 1024,
        required: true,
        type: String
    },
    lastPlay: {
        required: true,
        type: String
    },
    views: {
        default: 0,
        required: true,
        type: Number
    }
})

export default LocalSchema
