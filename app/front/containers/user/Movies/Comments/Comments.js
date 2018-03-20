'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import ConnectedCommentBox from './CommentBox/CommentBox'
import ConnectedDisplayComments from './DisplayComments/DisplayComments'

class CommentContainer extends Component {

    render() {

        return (
            <div>
                <ConnectedCommentBox movie={ this.props.movie }/>
                <ConnectedDisplayComments movie={ this.props.movie }/>
            </div>
        )
    }
}

CommentContainer.propTypes = {
    movie: PropTypes.string,
}

export default CommentContainer