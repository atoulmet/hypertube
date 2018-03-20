'use strict'

const initialState = {
    errors: [],
    hasSucceeded: false,
}

const editProfileStatus = (state = initialState, action) => { ////A fusionner avec userProfile ?
    switch (action.type)
    {
    case 'EDIT_PROFILE_FAIL':
        return { errors: action.errors, hasSucceeded: false }
    case 'EDIT_PROFILE_SUCCESS':
        return { errors: [], hasSucceeded: true }

    default:
        return state
    }
}

export default editProfileStatus