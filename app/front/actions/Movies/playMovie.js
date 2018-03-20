'use strict'

export const PLAY_SUCCESS = 'PLAY_SUCCESS'
export const PLAY_FAILURE = 'PLAY_FAILURE'

export const playSuccess = () => {
    return {
        type: PLAY_SUCCESS
    }
}

export const playFailure = errors => {
    return {
        errors,
        type: PLAY_FAILURE
    }
}

export const playAction = data => {
    return async dispatch => {
        const url = `http://localhost:3000/api/user/movie/play`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(playFailure(resJson.state.errors))
            }

            return dispatch(playSuccess())
        }
        catch (err) {
            return dispatch(playFailure(err))
        }
    }
}