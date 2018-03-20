'use strict'

import { combineReducers } from 'redux'

import auth from './auth'
import passwordHandling from './passwordHandling'
import backgrounds from './backgrounds'
import userProfile from './userProfile'
import editProfileStatus from './editProfile'
import editAccountStatus from './editAccount'
import movies from './movies'
import comments from './comments'

const rootReducers = combineReducers({
    auth,
    backgrounds,
    userProfile,
    editProfileStatus,
    editAccountStatus,
    movies,
    passwordHandling,
    comments
})

export default rootReducers