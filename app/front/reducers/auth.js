'use strict'

const isAuthenticated = localStorage.token ? true : false

const initialState = {
    errors: [],
    hasSucceeded: false,
    isAuthenticated,
    isLoading: false
}

const auth = (state = initialState, action) => {

    switch (action.type)
    {
    case 'SIGNIN_LOADING':
        return { ...state, hasSucceeded: false, isLoading: true, isAuthenticated: false }
    case 'SIGNIN_SUCCESS':
        return { ...state, errors: [], isAuthenticated: true, isLoading: false, username: action.username }
    case 'SIGNIN_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false, type: 'Signin'  }

    case 'REGISTRATION_LOADING':
        return { ...state, isAuthenticated: false, hasSucceeded: false, isLoading: true }
    case 'REGISTRATION_SUCCESS':
        return { ...state, isAuthenticated: false, hasSucceeded: true, isLoading: false }
    case 'REGISTRATION_FAILURE':
        return { errors: action.errors, isAuthenticated: false, hasSucceeded: false, isLoading: false  }

    case 'OAUTH_42_SUCCESS':
        return { ...state, isAuthenticated: true, username: action.username }
    case 'OAUTH_42_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false }

    case 'OAUTH_FB_SUCCESS':
        return { ...state, isAuthenticated: true, username: action.username }
    case 'OAUTH_FB_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false, type: 'FB' }

    case 'OAUTH_GOOGLE_SUCCESS':
        return { ...state, isAuthenticated: true, username: action.username }
    case 'OAUTH_GOOGLE_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false, type: 'Google' }

    case 'OAUTH_GITHUB_SUCCESS':
        return { ...state, isAuthenticated: true, username: action.username }
    case 'OAUTH_GITHUB_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false }

    case 'OAUTH_INSTAGRAM_SUCCESS':
        return { ...state, isAuthenticated: true, username: action.username }
    case 'OAUTH_INSTAGRAM_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false, isAuthenticated: false }


    case 'LOGOUT': {
        localStorage.removeItem('token')
        return { ...state, isAuthenticated: false }
    }

    default:
        return state
    }
}

export default auth