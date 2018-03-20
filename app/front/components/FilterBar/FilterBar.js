'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

import GenreFilter from './GenreFilter/GenreFilter'
import YearFilter from './YearFilter/YearFilter'
import RatingFilter from './RatingFilter/RatingFilter'
import SortBy from './SortBy/SortBy'

import { Icon, Menu } from 'antd'

class FilterBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
            yearFilter: [],
            genreFilter: '',
            ratingFilter: [],
            sortBy: ''
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state !== prevState) {
            this._applyFilters()
        }
    }

    _applyFilters = () => {
        let filtered = this.props.movieList
        const { yearFilter, genreFilter, ratingFilter, sortBy } = this.state
        if (yearFilter.length > 0) {
            filtered = filtered.filter((elem) => {
                if (elem.year && elem.year !== undefined && parseInt(elem.year) >= yearFilter[0] && elem.year <= yearFilter[1]) {
                    return elem
                }
            })
        }
        if (genreFilter !== '') {
            filtered = filtered.filter((elem) => {
                const genres = elem.genres
                if (genres && genres !== undefined && genres.length > 0 && genres.includes(genreFilter) === true) {
                    return elem
                }
            })
        }
        if (ratingFilter.length > 0) {
            filtered = filtered.filter((elem) => {
                if (elem.rating && elem.rating !== undefined && parseFloat(elem.rating) >= ratingFilter[0] && elem.rating <= ratingFilter[1]) {
                    return elem
                }
            })
        }
        if (sortBy === 'rating' && sortBy !== '') {
            filtered.sort(function (a, b) {
                return parseFloat(b.rating) - parseFloat(a.rating) })
        }
        if (sortBy === 'year' && sortBy !== '') {
            filtered.sort(function (a, b) {
                return b.year - a.year })
        }
        this.props._applyFilter(filtered)
    }

    _getFilterValues = (filter, type) => {
        if (type === 'YEAR')
            this.setState( { yearFilter: filter } )
        else if (type === 'GENRE')
            this.setState( { genreFilter: filter } )
        else if (type === 'RATING')
            this.setState( { ratingFilter: filter } )
        else if (type === 'SORTBY')
            this.setState( { sortBy: filter } )
    }

    render() {
        return (
            <Menu mode='horizontal'>
                <Menu.Item key='year'>
                    <Icon type='global' />
                    <YearFilter _getFilterValues={ this._getFilterValues }/>
                </Menu.Item>
                <Menu.Item key='genre'>
                    <Icon type='tags' />
                    <GenreFilter _getFilterValues={ this._getFilterValues }/>
                </Menu.Item>
                <Menu.Item key='rating'>
                    <Icon type='star-o' />
                    <RatingFilter _getFilterValues={ this._getFilterValues }/>
                </Menu.Item>
                <Menu.Item key='sort'>
                    <Icon type='sync' />
                    <SortBy _getFilterValues={ this._getFilterValues }/>
                </Menu.Item>
            </Menu>
        )
    }
}

FilterBar.propTypes = {
    _applyFilter: PropTypes.func,
    movieList: PropTypes.any,
}

export default FilterBar