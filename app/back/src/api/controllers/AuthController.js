'use strict'

import User from '../models/UserModel'

import EmailService from '../services/EmailService'
import * as PasswordService from '../services/PasswordService'
import * as JwtService from '../services/JwtService'
import * as ResponseService from '../services/ResponseService'

import error from '../../templates/vars/error'

export const signin = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            error.message = res.__('Signin error username')
            error.type = 'unique'
            return res.status(202).send(ResponseService.createErrorResponse([ error ]))
        }
        else {
            const hashedPassword = await PasswordService.hashPassword(password, user.salt)

            if (hashedPassword !== user.password) {
                error.message = res.__('Signin error password')
                error.type = 'unique'
                return res.status(202).send(ResponseService.createErrorResponse([ error ]))
            }
            else {
                const token = JwtService.tokenSign(user._id, user.username)
                return res.status(200).send(ResponseService.createResponse('token', token))
            }
        }
    }
    catch(err) {
        return res.sendStatus(202)
    }
}

export const signup = async (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const photoURL = req.body.photoURL

    const search = await User.find().or([ { username: username }, { email: email } ])

    if (search.length) {
        error.message = res.__('Register error username email', username, email)
        error.type = 'unique'
        return res.status(202).send(ResponseService.createErrorResponse([ error ]))
    }
    else {
        const user = new User()

        user.set('username', username)
        user.set('email', email)
        user.set('salt', await PasswordService.generateSalt())
        user.set('password', password)
        user.set('firstName', firstName)
        user.set('lastName', lastName)
        user.set('photoURL', photoURL)

        try {
            await user.validate()
            user.set('password', await PasswordService.hashPassword(password, user.get('salt')))
            await user.save()
            return res.status(201).send(ResponseService.createResponse(null, null))
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
            return res.status(202).send(ResponseService.createErrorResponse(errors))
        }
    }
}

export const forgotPassword = async (req, res) => {
    const email = req.body.email

    if (!email) {
        error.field = 'email'
        error.message = res.__('Forgot password error')
        ResponseService.createErrorResponse([ error ])
    }
    else {
        try {
            let user = await User.findOne().byMail(email)

            if (user) {
                user.set('token', await PasswordService.generateToken())
                user.save()
                await EmailService.forgotPassword(user)
            }
        }
        catch (err) {
            return res.status(202).send(ResponseService.createErrorResponse([ error ]))
        }
    }
    return res.status(202).send(ResponseService.createResponse(null, null))
}

export const resetPassword = async (req, res) => {
    const id = req.body.id
    const token = req.body.token
    const password = req.body.password

    try {
        const userData = await User.findById(id)

        if (!userData) {
            return res.sendStatus(400)
        }
        else {
            if (userData.token === token) {
                const newPassword = await PasswordService.hashPassword(password, userData.salt)

                try {
                    userData.set('password', password)
                    await userData.validate()
                    userData.set('password', newPassword)
                    await userData.save()
                }
                catch(err) {
                    const errors = []

                    for (let key in err.errors) {
                        let error = {
                            field: key,
                            message: err.errors[key].message,
                            type: err.errors[key].kind,
                        }
                        errors.push(error)
                    }
                    return res.status(202).send(ResponseService.createErrorResponse(errors))
                }

                return res.status(200).send(ResponseService.createResponse(null, null))
            }
        }
    }
    catch (err) {
        error.message = err.message
        error.field = 'password'
        return res.status(202).send(ResponseService.createErrorResponse([ error ]))
    }
}
