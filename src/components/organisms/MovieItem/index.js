import React, { Component } from 'react'
import { Image } from 'antd'
import { format } from 'date-fns'

import { MovieRatingValue } from '..'
import { GenresContext } from '../../services/api/GenresContext'

import './MovieItem.css'

export class MovieItem extends Component {
  static contextType = GenresContext

  constructor(props) {
    super(props)
    const { id } = this.props
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies') || '{}')
    const rating = ratedMovies[id] || 0
    this.state = {
      rating,
      isMobile: window.innerWidth < 550,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  handleWindowSizeChange = () => {
    this.setState({ isMobile: window.innerWidth < 550 })
  }

  updateRating = (ratingValue) => {
    this.setState({ rating: ratingValue })
  }

  shortenText(description, maxLength) {
    if (description.length <= maxLength) {
      return description
    }
    let trimmed = description.substr(0, maxLength)
    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))
    return `${trimmed} ...`
  }

  render() {
    const { isMobile } = this.state
    const { id, title, releaseDate, rating, posterPath, genreIds, overview, handleRatingChange } = this.props
    const genresFromContext = this.context.genres
    const shortTitle = this.shortenText(title, 20)
    const shortOverview = this.shortenText(overview, 150)
    let data = ''
    if (releaseDate) {
      data = format(releaseDate, 'PP')
    }
    let ratingColor = '#E90000' // Значение по умолчанию
    const ratingToFixed = rating.toFixed(1)
    if (rating > 7) {
      ratingColor = '#66E900'
    } else if (rating > 5) {
      ratingColor = '#E9D100'
    } else if (rating > 3) {
      ratingColor = '#E97E00'
    }
    const genreTags = genreIds
      .map((genreId) => genresFromContext.find((genre) => genre.id === genreId)) // возвращаем жанры на текущий фильм
      .filter((genre) => genre !== undefined) // есть ли жанры вообще
      .map((genre, index) => (
        <span key={index} className="genre-tag">
          {genre.name}
        </span>
      ))
    if (isMobile) {
      return (
        <div className="MovieItem">
          <div className="MovieDetails">
            <div className="MoviePoster">
              <Image width={60} height={91} src={posterPath} />
            </div>
            <div className="flex-column">
              <div className="flex-tittle">
                <h2 className="Title">{shortTitle}</h2>
                <div className="circleStyle" style={{ border: `solid ${ratingColor} 1px` }}>
                  {ratingToFixed}
                </div>
              </div>
              <span className="ReleaseDate">{data}</span>
              <div className="Genres">{genreTags}</div>
            </div>
          </div>
          <span className="Overview">{shortOverview}</span>
          <MovieRatingValue
            handleRatingChange={(ratingValue) => handleRatingChange(id, ratingValue)}
            updateRating={this.updateRating}
            rating={this.state.rating}
          />
        </div>
      )
    }
    return (
      <div className="MovieItem">
        <div className="MoviePoster">
          <Image width={183} height={281} src={posterPath} />
        </div>
        <div className="MovieDetails">
          <div className="flex-row">
            <h2 className="Title">{shortTitle}</h2>
            <div className="circleStyle" style={{ border: `solid ${ratingColor} 1px` }}>
              {ratingToFixed}
            </div>
          </div>
          <span className="ReleaseDate">{data}</span>
          <div className="Genres">{genreTags}</div>
          <span className="Overview">{shortOverview}</span>
          <MovieRatingValue
            handleRatingChange={(ratingValue) => handleRatingChange(id, ratingValue)}
            updateRating={this.updateRating}
            rating={this.state.rating}
          />
        </div>
      </div>
    )
  }
}
