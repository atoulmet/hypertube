'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { postCommentAction } from '../../../../../actions/index'

import { Input, Form, Button, message } from 'antd'
const { TextArea } = Input

class CommentBox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            comment: ''
        }
    }

    _checkField = (values, t) => {
        let errors = []
        const content = values.commentBox

        if (content && content.length > 400) {
            errors.push(t('Comment length error'))
        }

        return errors
    }

    _handleSubmit = (e, t) => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            const errorsComment = this._checkField(values, t)

            if (errorsComment.length) {
                errorsComment.forEach((elem) => {
                    message.error(elem)
                })
            }

            if (/\S/.test(values.commentBox) && !errors && !errorsComment.length && values.commentBox) {
                const data = {
                    content: values.commentBox,
                    author: localStorage.username,
                    movie: this.props.movie
                }

                this.props.postComment(data)
            }
        })
        this.props.form.setFieldsValue({ commentBox: '' })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <I18n>
                { (t) => (
                    <Form className='edit-profile-form' onSubmit={ (e) => this._handleSubmit(e, t) } >
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            { getFieldDecorator('commentBox', {
                            })(
                                <TextArea autosize placeholder={ t('Comment Box') } />
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={ { span: 24, offset: 0 } }>
                            <Button className='login-form-button large' htmlType='submit' type='primary'>{ t('Post') }</Button>
                        </Form.Item>
                    </Form>
                )}
            </I18n>
        )
    }
}

CommentBox.propTypes = {
    form: PropTypes.object,
    postComment: PropTypes.any,
    movie: PropTypes.string,
    comments: PropTypes.shape({
        errors: PropTypes.array,
        commentsArray: PropTypes.array,
        hasSucceeded: PropTypes.bool
    })
}
const mapStateToProps = () => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postComment: values => { dispatch(postCommentAction(values)) },
    }
}

const WrappedCommentBox = Form.create()(CommentBox)
const ConnectedCommentBox = connect(mapStateToProps, mapDispatchToProps)(WrappedCommentBox)

export default ConnectedCommentBox