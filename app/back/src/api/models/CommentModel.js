'use strict'

import Mongoose from 'mongoose'
import CommentSchema from '../schemas/CommentSchema'

export default Mongoose.model('Comment', CommentSchema)