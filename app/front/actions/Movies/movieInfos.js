'use strict'

export const MOVIE_INFOS_LOADING = 'MOVIE_INFOS_LOADING'
export const MOVIE_INFOS_SUCCESS = 'MOVIE_INFOS_SUCCESS'
export const MOVIE_INFOS_FAILURE = 'MOVIE_INFOS_FAILURE'

export const movieInfosLoading = () => {
    return {
        type: MOVIE_INFOS_LOADING
    }
}

export const movieInfosSuccess = movie => {
    return {
        movie,
        type: MOVIE_INFOS_SUCCESS
    }
}

export const movieInfosFailure = errors => {
    return {
        errors,
        type: MOVIE_INFOS_FAILURE
    }
}

export const movieInfosAction = (title, hash) => {
    return async dispatch => {
        const url = `http://localhost:3000/api/movies/${title}&${hash}`
        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': localStorage.token
            }
        }

        dispatch(movieInfosLoading())

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(movieInfosFailure(resJson.state.errors))
            }

            return dispatch(movieInfosSuccess(resJson.data.movie))
        }
        catch(err) {
            return dispatch(movieInfosFailure())
        }
    }
}