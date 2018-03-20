'use strict'

import jwt from 'jsonwebtoken'
import { jwt as secret } from '../../config/secret'

export const tokenSign = (id, username) => {
    return jwt.sign({ id: id, username: username, active: true, auth: true }, secret, {
        expiresIn: (60 * 60 * 24), // 1 year - TO BE SET TO RESONABLE VALUE
    })
}

export const tokenVerify = (req, res, next) => {
    const token = req.headers['x-session-token']
    const response = {
        state: {
            error: false,
            errors: new Array()
        },
    }

    if (token) {
        if (token === 'null' || token === undefined) {
            const error = {
                message: 'Undefined token',
                type: 'token'
            }

            response.error = true
            response.state.errors.push(error)
            return (res.status(200).send(response))
        }
        try {
            req.decoded = jwt.verify(token, secret)
            next()
        }
        catch (err) {
            const error = {
                message: 'Undefined token' + err,
                type: 'token'
            }

            response.error = true
            response.state.errors.push(error)
            return res.status(403).send(response)
        }
    }
    else {
        const error = {
            message: 'No token sent, token is mandatory for this route',
            type: 'token'
        }

        response.error = true
        response.state.errors.push(error)
        return res.status(401).send(response)
    }
}
