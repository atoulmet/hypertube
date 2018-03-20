'use strict'

import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const hashPassword = async (password, salt) => {
    if (!password)
        return (undefined)
    return (await bcrypt.hash(password, salt))
}

export const generateSalt = async () => {
    return (await bcrypt.genSalt(10))
}

export const generateToken = async () => {
    const hash = crypto.createHash('sha1')

    return (await hash.update(crypto.randomBytes(32)).digest('hex'))
}
