'use strict'

import Mongoose from 'mongoose'
import MovieSchema from '../schemas/MovieSchema'

export default Mongoose.model('Movie', MovieSchema)
