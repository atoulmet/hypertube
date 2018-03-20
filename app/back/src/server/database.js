'use strict'

import Mongoose from 'mongoose'
import { database as config } from '../config/config'
import { database as secret } from '../config/secret'

const databaseURI = `mongodb://${config.host}/${config.name}`
const database = Mongoose.connect(databaseURI, { user: secret.username, pass: secret.password })

export default database
