'use strict'

import React, { Component } from 'react'
import { I18n } from 'react-i18next'
import { PropTypes } from 'prop-types'
import { Select } from 'antd'

const Option = Select.Option

class GenreFilter extends Component {

    _handleChange = (value) => {
        this.props._getFilterValues(value, 'GENRE')
    }


    render() {

        return (
            <I18n>
                { (t) => (
                    <Select
                        onChange={ this._handleChange }
                        placeholder='Genre'
                        showSearch
                        style={ { width: 200 } }
                    >
                        <Option value='Action'>{ t('Action') }</Option>
                        <Option value='Adventure'>{ t('Adventure') }</Option>
                        <Option value='Comedy'>{ t('Comedy') }</Option>
                        <Option value='Biography'>{ t('Biography') }</Option>
                        <Option value='Drama'>{ t('Drama') }</Option>
                        <Option value='Sci-Fi'>{ t('Sci-Fi') }</Option>
                        <Option value='Thriller'>{ t('Thriller') }</Option>
                        <Option value='Family'>{ t('Family') }</Option>
                        <Option value='Animation'>{ t('Animation') }</Option>
                        <Option value='Fantasy'>{ t('Fantasy') }</Option>
                        <Option value='Romance'>{ t('Romance') }</Option>
                        <Option value='Crime'>{ t('Crime') }</Option>
                        <Option value='Horror'>{ t('Horror') }</Option>
                        <Option value='Mystery'>{ t('Mystery') }</Option>
                        <Option value='Western'>{ t('Western') }</Option>
                    </Select>
                )}
            </I18n>
        )
    }
}

GenreFilter.propTypes = {
    _getFilterValues: PropTypes.func
}

export default GenreFilter