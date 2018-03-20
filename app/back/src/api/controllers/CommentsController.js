'use strict'

import Comment from '../models/CommentModel'
import * as ResponseService from '../services/ResponseService'
import error from '../../templates/vars/error'

export const postComment = async (req, res) => {
    const movie = req.body.movie
    const author = req.body.author
    const content = req.body.content

    try {
        const comment = new Comment
        const b = new Buffer(movie)
        const movieID = b.toString('base64')

        comment.set('movieID', movieID)
        comment.set('movie', movie)
        comment.set('author', author)
        comment.set('date', Date())
        comment.set('content', content)

        await comment.validate()
        await comment.save()

        const comments = await Comment.find({ movie: movie })

        return res.status(200).send(ResponseService.createResponse('thread', comments))
    }
    catch(e) {
        error.message = e.message
        error.field = 'post-comment'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}

export const searchComments = async (req, res) => {
    const movie = req.params.movie

    try {
        const comments = await Comment.find({ movie: movie })

        return res.status(200).send(ResponseService.createResponse('thread', comments))        
    }
    catch (e) {
        error.message = e.message
        error.field = 'search-comments'
        return res.status(203).send(ResponseService.createErrorResponse([ error ]))
    }
}