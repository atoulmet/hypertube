'use strict'

const initialState = {
    errors: [],
    isLoading: false,
    hasSucceeded: false,
}

const registration = (state = initialState, action) => {

    switch (action.type)
    {
    case 'REGISTRATION_LOADING':
        return { errors: [], hasSucceeded: false, isLoading: true }
    case 'REGISTRATION_SUCCESS':
        return { errors: [], hasSucceeded: true, isLoading: false }
    case 'REGISTRATION_FAILURE':
        return { errors: action.errors, hasSucceeded: false, isLoading: false  }

    default:
        return state
    }
}

export default registration