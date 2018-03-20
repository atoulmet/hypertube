'use strict'

import Mongoose from 'mongoose'
import LocalSchema from '../schemas/LocalSchema'

LocalSchema.query.byTitle = function(title) {
    return this.findOne({ title: title })
}

export default Mongoose.model('Local', LocalSchema)