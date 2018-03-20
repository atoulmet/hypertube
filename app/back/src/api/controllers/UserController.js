'use strict'

import md5 from 'md5'

import User from '../models/UserModel'
import * as MovieController from './MovieController'
import * as ResponseService from '../services/ResponseService'
import * as PasswordService from '../services/PasswordService'
import error from '../../templates/vars/error'

export const updateEmail = async (req, res) => {
    const id = req.decoded.id
    const email = req.body.email

    try {
        const userData = await User.findById(id)

        if (!userData) {
            return res.sendStatus(204)
        }
        else {
            userData.set('email', email)
            await userData.save()

            return res.status(200).send(ResponseService.createResponse(null, null))
        }
    }
    catch (e) {
        const code = e.code
        let message = ''

        if (code === 11000) {
            message = res.__('Update email duplicate')
        }
        else {
            message = res.__('Update email error')
        }

        error.field = 'email'
        error.message = message
        error.type = 'duplicate'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const updateUsername = async (req, res) => {
    const id = req.decoded.id
    const username = req.body.username

    try {
        const userData = await User.findById(id)

        if (!userData) {
            return res.sendStatus(204)
        }
        else {
            userData.set('username', username)
            await userData.save()

            return res.status(200).send(ResponseService.createResponse(null, null))
        }
    }
    catch (e) {
        const code = e.code
        let message = ''

        if (code === 11000) {
            message = res.__('Update username error duplicate')
        }
        else {
            message = res.__('Update username error length')
        }

        error.field = 'username'
        error.message = message
        error.type = 'regexp'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const updatePassword = async (req, res) => {
    const id = req.decoded.id
    const password = req.body.password

    try {
        const userData = await User.findById(id)

        if (!userData) {
            return res.sendStatus(204)
        }
        else {
            const newPassword = await PasswordService.hashPassword(password, userData.salt)
            userData.set('password', password)

            try {
                await userData.validate()
                userData.set('password', newPassword)
                await userData.save()
            }
            catch(err) {
                error.field = 'password'
                error.message = res.__('Update password error')
                error.type = 'regexp'
                return res.status(202).send(ResponseService.createErrorResponse([ error ]))
            }

            return res.status(200).send(ResponseService.createResponse(null, null))
        }
    }
    catch(e) {
        error.message = e.message
        error.field = 'password'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const updatePublicInfos = async (req, res) => {
    const id = req.decoded.id
    const photoURL = req.body.photoURL
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    try {
        const userData = await User.findById(id)

        if (!userData) {
            return res.sendStatus(204)
        }
        else {
            if (photoURL)
                userData.set('photoURL', photoURL)
            if (firstName)
                userData.set('firstName', firstName)
            if (lastName)
                userData.set('lastName', lastName)

            await userData.save()

            return res.status(200).send(ResponseService.createResponse(null, null))
        }
    }
    catch (e) {
        error.message = res.__('Update profile error')
        error.field = 'update public informations'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const getUserPublicInfos = async (req, res) => {
    const username = req.params.username

    try {
        let user = await User.findOne().byUsername(username)

        if (!user) {
            return res.sendStatus(204)
        }
        else {
            let movies = []

            user.movies.forEach(element => {
                movies.push(element.title)
            })

            const singleTitles = Array.from(new Set(movies))

            const userInfos = {
                photoURL: user.photoURL,
                firstName: user.firstName,
                lastName: user.lastName,
                movies: singleTitles
            }

            return res.status(200).send(ResponseService.createResponse('user', userInfos))
        }
    }
    catch(e) {
        error.message = e.message
        error.field = 'user public informations'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const playMovie = async (req, res) => {
    const id = req.decoded.id
    const title = req.body.title
    const magnet = req.body.magnet
    const movieID = md5(magnet)

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.sendStatus(203)
        }
        else {

            try {
                const path = `./files/${magnet}`

                await MovieController.saveMovieLocally(title, magnet, path)
            }
            catch (err) {
                error.message = err.message
                error.field = 'movie view count'
                return res.status(203).send(ResponseService.createErrorResponse([ error ]))
            }

            const movieInfos = {
                id: movieID,
                title: title.toLowerCase()
            }

            try {
                if (user.movies && user.movies.length > 0) {
                    user.movies.push(movieInfos)
                }
                else {
                    user.set('movies', movieInfos)
                }

                await user.save()
            }
            catch (err) {
                error.message = err.message
                error.field = 'user movie viewed'
                return res.status(203).send(ResponseService.createErrorResponse([ error ]))
            }
        }

        return res.status(200).send(ResponseService.createResponse(null, null))
    }
    catch(err) {
        error.message = err.message
        error.field = 'user save movie viewed'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const logout = async (req, res) => {
    return res.status(200)
}
