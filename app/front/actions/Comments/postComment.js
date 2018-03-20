'use strict'

export const POST_COMMENT_LOADING = 'POST_COMMENT_LOADING'
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS'
export const POST_COMMENT_FAILURE = 'POST_COMMENT_FAILURE'

export const postCommentLoading = () => {
    return {
        type: POST_COMMENT_LOADING
    }
}

export const postCommentSuccess = comments => {
    return {
        comments,
        type: POST_COMMENT_SUCCESS
    }
}

export const postCommentFailure = errors => {
    return {
        errors,
        type: POST_COMMENT_FAILURE
    }
}

export const postCommentAction = data => {
    return async dispatch => {
        const url = `http://localhost:3000/api/movies/movie/comment`
        const parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': localStorage.token
            },
            body: JSON.stringify(data)
        }

        dispatch(postCommentLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(postCommentFailure(resJson.state.errors))
            }
            const comments = resJson.data.thread

            return dispatch(postCommentSuccess(comments))
        }
        catch (err) {
            return dispatch(postCommentFailure())
        }
    }
}