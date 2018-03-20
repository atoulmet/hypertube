'use strict'

import { Schema } from 'mongoose'

const MovieSchema = new Schema({
    title: {
        lowercase: true,
        maxlength: 128,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    year: {
        lowercase: true,
        maxlength: 4,
        required: true,
        trim: true,
        type: String
    },
    rating: {
        lowercase: true,
        maxlength: 32,
        required: true,
        trim: true,
        type: String
    },
    casting: {
        default: [],
        lowercase: true,
        required: false,
        trim: true,
        type: [ String ]
    },
    genres: {
        default: [],
        required: false,
        trim: false,
        type: [ String ]
    },
    synopsis: {
        default: '',
        lowercase: true,
        required: false,
        trim: true,
        type: String
    },
    poster: {
        default: 'https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png',
        maxlength: 1024,
        required: false,
        type: String
    },
    comments: {
        default: [],
        required: false,
        type: [ Schema.Types.ObjectId ]
    },
    likes: {
        default: [],
        required: false,
        type: [ Schema.Types.ObjectId ]
    },
    magnet: {
        required: true,
        type: String
    }
})

export default MovieSchema
