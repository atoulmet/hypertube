'use strict'

import helmet from 'helmet'
import express from 'express'

import passport from 'passport'
import FacebookTokenStrategy from 'passport-facebook-token'
import GithubTokenStrategy from 'passport-github-token'
import InstagramTokenStrategy from 'passport-instagram-token'
import { Strategy as GoogleTokenStrategy } from 'passport-google-token'

import * as OAuth42 from '../api/oauth/OAuth42'
import * as OAuthFacebook from '../api/oauth/OAuthFacebook'
import * as OAuthGoogle from '../api/oauth/OAuthGoogle'
import * as OAuthGithub from '../api/oauth/OAuthGithub'
import * as OAuthInstagram from '../api/oauth/OAuthInstagram'

import * as AuthController from '../api/controllers/AuthController'
import * as UserController from '../api/controllers/UserController'
import * as MovieController from '../api/controllers/MovieController'
import * as CommentsController from '../api/controllers/CommentsController'

import * as StreamService from '../api/services/StreamService'
import * as JwtService from '../api/services/JwtService'
import * as ResponseService from '../api/services/ResponseService'

import error from '../templates/vars/error'
import User from '../api/models/UserModel'

import { oauth as secret } from '../config/secret.js'
import { oauth as config } from '../config/config.js'

const router = express.Router()

router.use(helmet())

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, x-session-token')
    res.header('Access-Control-Allow-Methods', 'POST, GET')
    res.header('Content-Type', 'application/json')

    if (req.method === 'OPTIONS') {
        return res.status(200).send({})
    } else {
        next()
    }
})

/**
 * Public routes
 */
router.post('/api/user/signin', AuthController.signin)
router.post('/api/user/signup', AuthController.signup)
router.post('/api/user/forgot-password', AuthController.forgotPassword)
router.post('/api/user/reset-password', AuthController.resetPassword)
router.get('/api/stream/:magnet&:title', StreamService.streamingHandler)


/**
 * OAuth routes
 */

router.post('/api/oauth/42', OAuth42.signup)

passport.use(new FacebookTokenStrategy({
    clientID: config.FB.client.id,
    clientSecret: secret.FB.client.secret,
    profileFields: [ 'id', 'displayName', 'first_name', 'last_name', 'photos', 'emails' ]
}, OAuthFacebook.control))

passport.use(new GoogleTokenStrategy({
    clientID: config.Google.client.id,
    clientSecret: secret.Google.client.secret,
}, OAuthGoogle.control))

passport.use(new GithubTokenStrategy({
    clientID: config.Github.client.id,
    clientSecret: secret.Github.client.secret,
    passReqToCallback: true
}, OAuthGithub.control))

passport.use(new InstagramTokenStrategy({
    clientID: config.Instagram.client.id,
    clientSecret: secret.Instagram.client.secret,
    passReqToCallback: true
}, OAuthInstagram.control))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

router.get('/api/oauth/facebook/token?:access_token',
    passport.authenticate('facebook-token', { scope: [ 'email' ] }),
    OAuthFacebook.authCallback, (err, req, res, next) => {
        if (err) {
            if (err.oauthError) {
                const content = JSON.parse(err.oauthError.data)

                if (content.error.code == 190) {
                    error.field = 'authentication'
                    error.message = 'Facebook access token expired'
                    error.type = 'unique'
                    return res.status(203).send(ResponseService.createErrorResponse([ error ]))
                }
            }
            else {
                error.field = 'authentication'
                error.message = 'The username your are trying to login with is already taken'
                error.type = 'unique'
                return res.status(203).send(ResponseService.createErrorResponse([ error ]))
            }
        }
        return res.sendStatus(200)
    }
)

router.get('/api/oauth/google/token?:access_token',
    passport.authenticate('google-token', { scope: [ 'email' ] }),
    OAuthGoogle.authCallback, (err, req, res, next) => {
        if (err) {
            let message = ''

            if (err.errors && err.errors.username && err.errors.username.message) {
                message = err.errors.username.message
            }
            else {
                message = 'The username your are trying to login with is already taken'
            }

            error.field = 'authentication'
            error.message = message
            error.type = 'unique'
            return res.status(203).send(ResponseService.createErrorResponse([ error ]))
        }
        return res.sendStatus(200)
    })

router.post('/api/oauth/github', OAuthGithub.handleCode)
router.get('/api/oauth/github/token?:access_token',
    passport.authenticate('github-token'),
    OAuthGithub.authCallback, (err, req, res, next) => {
        if (err) {
            let message = ''

            if (err && err.message) {
                message = err.message
            }
            else {
                message = err
            }

            error.field = 'authentication'
            error.message = message
            error.type = 'unique'
            return res.status(203).send(ResponseService.createErrorResponse([ error ]))
        }
        return res.sendStatus(200)
    }
)

router.get('/api/oauth/instagram/token?:access_token',
    passport.authenticate('instagram-token', { scope: [ 'email' ] }),
    OAuthInstagram.authCallback, (err, req, res, next) => {
        if (err) {
            error.field = 'authentication'
            error.message = 'The username your are trying to login with is already taken'
            error.type = 'unique'
            return res.status(203).send(ResponseService.createErrorResponse([ error ]))
        }
        return res.sendStatus(200)
    })

/**
 * Middleware verifying JWT - From here all the routes are protected with authentication
*/
router.use((req, res, next) => {
    JwtService.tokenVerify(req, res, next)
})

/**
 * Private routes
 */

router.get('/api/user/profile/:username', UserController.getUserPublicInfos)
router.post('/api/user/edit/profile', UserController.updatePublicInfos)
router.post('/api/user/edit/account/username', UserController.updateUsername)
router.post('/api/user/edit/account/email', UserController.updateEmail)
router.post('/api/user/edit/account/password', UserController.updatePassword)
router.post('/api/user/movie/play', UserController.playMovie)
router.get('/api/logout', UserController.logout)

router.get('/api/movies/thumbnails/:page', MovieController.popularMovies)
router.post('/api/movies/search', MovieController.searchMovies)
router.get('/api/movies/:movie&:hash', MovieController.movieDetails)
router.post('/api/movies/movie/comment', CommentsController.postComment)
router.get('/api/movies/movie/comments/:movie', CommentsController.searchComments)

router.use((req, res) => {
    return (res.sendStatus(404))
})

export default router