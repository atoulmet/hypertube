'use strict'

import fetch from 'fetch'
import { create as connect } from 'simple-oauth2'

import User from '../models/UserModel'

import * as PasswordService from '../services/PasswordService'
import * as JwtService from '../services/JwtService'
import * as ResponseService from '../services/ResponseService'

import { oauth as config } from '../../config/config.js'
import { oauth as secret } from '../../config/secret.js'

export const signup = (req, res) => {
    const code = req.body.code
    const tokenConfig ={
        code: code,
        redirect_uri: config['42'].auth.redirectURI
    }
    const oauth2 = connect({ auth: { tokenHost: config['42'].auth.tokenHost }, client: { id: config['42'].client.id, secret: secret['42'].client.secret } } )

    oauth2.authorizationCode.getToken(tokenConfig, (err, result) => {
        if (err) {
            const response = ResponseService.createErrorResponse([ { field: '', message: err , type: '' } ])
            return res.status(202).send(response)
        }

        const oauthData = oauth2.accessToken.create(result)
        const fetchOpts = { 'headers': {} }

        fetchOpts.headers['Authorization'] = 'Bearer ' + oauthData.token.access_token
        fetch.fetchUrl(config['42'].url, fetchOpts, async (err, meta, result) => {
            if (err) {
                const response = ResponseService.createErrorResponse([ { field: '', message: err , type: '' } ])
                return res.status(202).send(response)
            }

            const oauthUser = JSON.parse(result.toString())
            const oauthUsername = (oauthUser) ? oauthUser.login : null

            if (!oauthUsername.length) {
                const response = ResponseService.createErrorResponse([ { field: '', message:  'The username provided by the API is empty or invalid' , type: '' } ])
                return res.status(202).send(response)
            }
            let user = await User.findOne().byMail(oauthUser.email.toLowerCase())

            if (!user) {
                const newUser = new User()

                newUser.set('username', oauthUser.login)
                newUser.set('email', oauthUser.email)
                newUser.set('salt', await PasswordService.generateSalt())
                newUser.set('password', await PasswordService.generateSalt()) // Must be generated randomly and given to the user by email
                newUser.set('firstName', oauthUser.first_name)
                newUser.set('lastName', oauthUser.last_name)
                newUser.set('photoURL', oauthUser.image_url)

                try {
                    await newUser.validate()
                    newUser.set('password', await PasswordService.hashPassword(newUser.get('password'), newUser.get('salt')))
                    await newUser.save()
                    user = newUser
                }
                catch (err) {
                    const errors = []

                    for (let key in err.errors) {
                        let error = {
                            field: key,
                            message: err.errors[key].message,
                            type: err.errors[key].kind,
                        }
                        errors.push(error)
                    }

                    if (errors.length < 1) {
                        let error = {
                            field: 'authentication',
                            message: 'The username your are trying to login with is already taken',
                            type: 'unique'
                        }
                        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
                    }
                    return res.status(203).send(ResponseService.createErrorResponse(errors))
                }
            }
            return res.status(200).send(ResponseService.createResponse('token', JwtService.tokenSign(user._id, user.username)))
        })
    })
}