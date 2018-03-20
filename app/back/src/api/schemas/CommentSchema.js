'use strict'

import { Schema } from 'mongoose'

const CommentSchema = new Schema({
    author: {
        lowercase: true,
        maxlength: 128,
        minlength: 1,
        required: true,
        type: String,
    },
    content: {
        maxlength: 400,
        required: true,
        type: String
    },
    date: {
        required: true,
        type: Date
    },
    movie: {
        lowercase: true,
        required: true,
        type: String
    },
    movieID: {
        required: true,
        type: String
    }
})

export default CommentSchema