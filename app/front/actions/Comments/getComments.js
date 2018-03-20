'use strict'

export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS'
export const GET_COMMENTS_FAILURE = 'GET_COMMENTS_FAILURE'

export const getCommentsSuccess = comments => {
    return {
        comments,
        type: GET_COMMENTS_SUCCESS
    }
}

export const getCommentsFailure = errors => {
    return {
        errors,
        type: GET_COMMENTS_FAILURE
    }
}

export const getCommentsAction = data => {
    return async dispatch => {
        const url = `http://localhost:3000/api/movies/movie/comments/${data}`
        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': localStorage.token
            }
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(getCommentsFailure(resJson.state.errors))
            }
            const comments = resJson.data.thread

            return dispatch(getCommentsSuccess(comments))
        }
        catch (err) {
            return dispatch(getCommentsFailure())
        }
    }
}