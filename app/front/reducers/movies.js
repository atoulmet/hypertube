'use strict'

const initialState = {
    errors: [],
    isLoading: false,
    hasSucceeded: false
}

const movies = (state = initialState, action) => {

    switch(action.type)
    {
    case 'MOVIE_INFOS_LOADING':
        return { errors: [], isLoading: true, hasSucceeded: false }
    case 'MOVIE_INFOS_SUCCESS':
        return { ...state, hasSucceeded: true, movie: action.movie }
    case 'MOVIE_INFOS_FAILURE':
        return { errors: action.errors, isLoading: false, hasSucceeded: false }

    case 'GET_MOVIES_LOADING':
        return { errors: [], isLoading: true, hasSucceeded: false }
    case 'GET_MOVIES_SUCCESS':
        return { ...state, hasSucceeded: true, list: action.movies, isLoading: false }
    case 'GET_MOVIES_FAILURE':
        return { errors: action.errors, isLoading: false, hasSucceeded: false }
    case 'RESET_MOVIES':
        return { errors: [], isLoading: true, hasSucceeded: false }

    case 'SEARCH_MOVIES_LOADING':
        return { errors: [], isLoading: true, hasSucceeded: false }
    case 'SEARCH_MOVIES_SUCCESS':
        return { ...state, hasSucceeded: true, searchList: action.movies, isLoading: false }
    case 'SEARCH_MOVIES_FAILURE':
        return { errors: action.errors, isLoading: false, hasSucceeded: false }

    case 'PLAY_SUCCESS':
        return { ...state, hasSucceeded: true }
    case 'PLAY_FAILURE':
        return { errors: action.errors, hasSucceeded: false }

    default:
        return state
    }
}

export default movies