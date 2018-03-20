'use strict'

import mailer from 'nodemailer'
import { mail as config } from '../../config/config.js'
import { mail as secret } from '../../config/secret.js'

const PasswordRequestTemplate = require('../../templates/mails/password-request.js')

const transporter = mailer.createTransport({
    service: config.service,
    auth: {
        user: secret.username,
        pass: secret.password,
    }
})

const EmailService = {

    forgotPassword: (data) => {
        const options = {
            from: config.from,
            to: data.email,
            subject: PasswordRequestTemplate.subject,
            html: PasswordRequestTemplate.link(data._id, data.token)
        }
        transporter.sendMail(options, function (err, result) {
            console.log('-> Email sent: ', result)
        })
    }
}

export default EmailService
