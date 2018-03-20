'use strict'

const initialState = {
    errors: [],
    isLoading: false,
    hasSucceeded: false
}

const getUserProfile = (state = initialState, action) => {

    switch (action.type)
    {
    case 'GET_USER_PROFILE_SUCCESS':
        return {
            firstName: action.data.user.firstName,
            lastName: action.data.user.lastName,
            photoURL: action.data.user.photoURL,
            movies: action.data.user.movies
        }

    default:
        return state
    }
}

export default getUserProfile