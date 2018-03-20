'use strict'

import User from '../models/UserModel'

import * as PasswordService from '../services/PasswordService'
import * as ResponseService from '../services/ResponseService'
import * as JwtService from '../services/JwtService'
import error from '../../templates/vars/error'

export const control = async (accessToken, refreshToken, profile, done) => {
    const email = profile._json.email
    const name = profile._json.name
    const firstName = profile._json.given_name
    let lastName = profile._json.family_name
    const photoURL = profile._json.picture


    try {

        if (lastName === '') {
            lastName = 'none'
        }

        let user = await User.findOne().byMail(email.toLowerCase())
        if (!user) {
            const newUser = new User()

            newUser.set('username', name)
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
                return done(err)
            }
        }
        done(null, user)
    }
    catch(err) {
        return done(err)
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
        error.message = 'Google login'
        error.type = 'unique'
        return res.status(202).send(ResponseService.createErrorResponse([ error ]))
    }
}