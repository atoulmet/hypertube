'use strict'

export const SEARCH_MOVIES_LOADING = 'SEARCH_MOVIES_LOADING'
export const SEARCH_MOVIES_SUCCESS = 'SEARCH_MOVIES_SUCCESS'
export const SEARCH_MOVIES_FAILURE = 'SEARCH_MOVIES_FAILURE'

export const searchMoviesLoading = () => {
    return {
        type: SEARCH_MOVIES_LOADING
    }
}

export const searchMoviesSuccess = movies => {
    return {
        movies,
        type: SEARCH_MOVIES_SUCCESS
    }
}

export const searchMoviesFailure = errors => {
    return {
        errors,
        type: SEARCH_MOVIES_FAILURE
    }
}

export const searchMoviesAction = (title, history) => {
    return async dispatch => {
        const url = `http://localhost:3000/api/movies/search`
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-session-token': localStorage.token },
            body: JSON.stringify({ movie: title })
        }

        dispatch(searchMoviesLoading())
        history.push('/search')

        try {
            const res = await fetch(url, parameters)
            const resJson = await res.json()

            if (resJson.state.error === true) {
                return dispatch(searchMoviesFailure(resJson.state.errors))
            }

            const movies = resJson.data.search

            return dispatch(searchMoviesSuccess(movies))
        }
        catch (err) {
            return dispatch(searchMoviesFailure(err))
        }
    }
}