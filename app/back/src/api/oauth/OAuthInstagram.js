'use strict'

import User from '../models/UserModel'

import * as PasswordService from '../services/PasswordService'
import * as ResponseService from '../services/ResponseService'
import * as JwtService from '../services/JwtService'
import error from '../../templates/vars/error'

export const control = async (req, accessToken, refreshToken, profile, next) => { 
    const email = `${profile.username}${profile.id}@gmail.com`
    const name = `${profile.username}${profile.id}`
    const username = name.replace(/[^a-z\d ]/i, '')
    const firstName = profile.username
    const lastName = 'None'
    const photoURL = profile.photos[0].value
    try {
        let user = await User.findOne().byMail(email.toLowerCase())
        if (!user) {
            const newUser = new User()
            newUser.set('username', username)
            newUser.set('email', email)
            newUser.set('salt', await PasswordService.generateSalt())
            newUser.set('password', await PasswordService.generateSalt())
            newUser.set('firstName', firstName)
            newUser.set('lastName', lastName)
            newUser.set('photoURL', photoURL)

            try {
                await newUser.validate()
                await newUser.save()
                user = newUser
            }
            catch(err) {
                return next(err)
            }
        }
        next(null, user)
    }
    catch(err) {
        return next(err)
    }
}

export const authCallback = async (req, res) => {
    try {
        const userID = req.session.passport.user._id
        const username = req.session.passport.user.username
        const token = JwtService.tokenSign(userID, username)

        return res.status(202).send(ResponseService.createResponse('token', token))
    }
    catch(err) {
        error.field = 'authentication'
        error.message = 'Instagram login'
        error.type = 'unique'
        return res.status(202).send(ResponseService.createErrorResponse([ error ]))
    }
}