'use strict'

export const GET_MOVIES_LOADING = 'GET_MOVIES_LOADING'
export const GET_MOVIES_SUCCESS = 'GET_MOVIES_SUCCESS'
export const GET_MOVIES_FAILURE = 'GET_MOVIES_FAILURE'
export const RESET_MOVIES = 'RESET_MOVIES'

export const getMoviesLoading = () => {
    return {
        type: GET_MOVIES_LOADING
    }
}

export const getMoviesSuccess = movies => {
    return {
        movies,
        type: GET_MOVIES_SUCCESS
    }
}

export const getMoviesFailure = errors => {
    return {
        errors,
        type: GET_MOVIES_FAILURE
    }
}

export const resetMoviesAction = () => {
    return {
        type: RESET_MOVIES
    }
}

export const getMoviesAction = page => {
    return async dispatch => {
        const url = `http://localhost:3000/api/movies/thumbnails/${page}`
        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': localStorage.token
            }
        }

        dispatch(getMoviesLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(getMoviesFailure(resJson.state.errors))
            }
            const movies = resJson.data.search
            if (movies.length === 0) {
                return
            }
            return dispatch(getMoviesSuccess(movies))
        }
        catch(err) {
            return dispatch(getMoviesFailure)
        }
    }
}