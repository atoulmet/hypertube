'use strict'

import bodyParser from 'body-parser'
import express  from 'express'
import session from 'express-session'
import passport from 'passport'
import path from 'path'
import i18n from 'i18n'
import { CronJob as CronJob } from 'cron'

import { application as config } from './config/config.js'
import { jwt as secret } from './config/secret.js'
import connection from './server/database'
import router from './server/routes'
import * as cronService from '../src/api/services/cronService'

const app = express()

connection
    .then(() => {
        /* Api authentication for JWT */
        app.set('secretApi', secret.jwt)

        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json({ limit: '5mb' }))
        app.use(session({ secret: 'helloSession', resave: true, saveUninitialized: true }))

        i18n.configure({
            locales: [ 'en', 'fr' ],
            directory: './locales'
        })

        app.use(i18n.init)

        app.use(passport.initialize())
        app.use(passport.session())

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
            next()
        })

        app.use('/files', express.static(path.join(__dirname, '../files')))


        /* Daily at 7am */
        const job = new CronJob('0 7 * * *', () => {
            cronService.getPopularMovies()
            cronService.removeOutdated()
        }, null, true, 'Europe/Paris')


        app.use('/', router)
        app.listen(config.port)

        console.log('Cron job status: ', job.running)
        console.log(`Server running on port ${config.port}`)
    })
    .catch((err) => {
        console.error(err)
    })
