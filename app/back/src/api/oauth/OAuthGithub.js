'use strict'

import request from 'request'

import User from '../models/UserModel'
import * as PasswordService from '../services/PasswordService'
import * as ResponseService from '../services/ResponseService'
import * as JwtService from '../services/JwtService'
import * as StabilityService from '../services/StabilityService'
import error from '../../templates/vars/error'
import { oauth as config } from '../../config/config.js'
import { oauth as secret } from '../../config/secret.js'

export const handleCode = async (req, res) => {
    const code = req.body.code
    const url = 'https://github.com/login/oauth/access_token'
    const parameters = {
        url: url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        form: {
            client_id: config.Github.client.id,
            client_secret: secret.Github.client.secret,
            code: code
        }
    }

    request(parameters, (error, response, body) => {
        if (error) {
            error.field = 'authentication'
            error.message = 'Github code'
            error.type = 'unique'
            return res.status(202).send(ResponseService.createErrorResponse([ error ]))
        }
        const content = StabilityService.parseJSON(body)
        const token = content.access_token

        return res.status(200).send(ResponseService.createResponse('access_token', token))
    })
}

export const control = async (req, accessToken, refreshToken, profile, done) => {
    const email = profile._json.email
    const name = profile.displayName
    const firstName = profile.name.givenName
    let lastName = profile.name.familyName
    let photoURL = ''

    if (lastName === '') {
        lastName = 'none'
    }

    if (profile._json.avatar_url) {
        photoURL = profile._json.avatar_url
    }

    try {
        if (email) {
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
                catch (err) {
                    return done('The username your are trying to login with is already taken')
                }
            }
            return done(null, user)
        }
        else {
            return done('Make sure that your Github email informations are public in order to login')
        }
    }
    catch (err) {
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
    catch (err) {
        error.field = 'authentication'
        error.message = 'Github login'
        error.type = 'unique'
        return res.status(202).send(ResponseService.createErrorResponse([ error ]))
    }
}
