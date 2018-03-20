'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { List, Avatar } from 'antd'
import moment from 'moment'

import { getCommentsAction } from '../../../../../actions/Comments/getComments'

class DisplayComments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            comments: props.comments
        }
    }

    componentWillMount() {
        this.props.getComments(this.props.movie)
    }

    componentWillReceiveProps(nextProps) {
        const state = this.state

        state['comments'] = nextProps.comments
        this.setState(state)
    }

    _mapCommentsArray = (commentsArray) => {
        if (commentsArray !== undefined && commentsArray.length !== 0) {
            const sortedComments = commentsArray.sort((a, b) => { return (Date.parse(b.date) / 1000) - (Date.parse(a.date) / 1000) })
            let comments = []

            sortedComments.forEach(element => {
                const content = {
                    id: '',
                    author: '',
                    body: '',
                    time: ''
                }
                content.id = element._id
                content.author = element.author
                content.body = element.content

                const now = moment.now()
                const time = moment(element.date)

                content.time = time.from(now)
                comments.push(content)
            })

            const JSXcomments =
                <List
                dataSource={ comments }
                itemLayout='horizontal'
                renderItem={ item => (
                    <List.Item key={ item.id }>
                        <List.Item.Meta
                            avatar={ <Avatar src='https://static.tplugin.com/tplugin/img/unknown-user.png' /> }
                            description={ item.body }
                            title={ <Link to={ `/users/${item.author}` } >{item.author} - {item.time}</Link> }
                        />
                    </List.Item>
                ) }/>
            return (JSXcomments)
        }
        else
            return null
    }

    render() {
        const { commentsArray } = this.state.comments
        const JSXcomments = this._mapCommentsArray(commentsArray)
        return (
            <div>
                {JSXcomments}
            </div>
        )
    }
}

DisplayComments.propTypes = {
    comments: PropTypes.shape({
        errors: PropTypes.array,
        commentsArray: PropTypes.array,
        hasSucceeded: PropTypes.bool
    }),
    movie: PropTypes.string,
    getComments: PropTypes.func
}
const mapStateToProps = (state) => {
    return {
        comments: state.comments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getComments: (data) => { dispatch(getCommentsAction(data)) }
    }
}

const ConnectedDisplayComments = connect(mapStateToProps, mapDispatchToProps)(DisplayComments)

export default ConnectedDisplayComments