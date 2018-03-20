'use strict'

const initialState = {
    errors: [],
    hasSucceeded: false,
}

const editProfileStatus = (state = initialState, action) => {
    switch (action.type)
    {
    case 'POST_COMMENT_SUCCESS':
        return { errors: [], hasSucceeded: true, commentsArray: action.comments }
    case 'POST_COMMENT_FAILURE':
        return { errors: action.errors, hasSucceeded: false }
    case 'GET_COMMENTS_SUCCESS':
        return { errors: [], hasSucceeded: true, commentsArray: action.comments }
    case 'GET_COMMENTS_FAILURE':
        return { errors: action.errors, hasSucceeded: false }

    default:
        return state
    }
}

export default editProfileStatus