// В MovieItem.js

import React, { Component } from 'react'
import { Image } from 'antd'
import { format } from 'date-fns'

import './MovieItem.css'

export class MovieItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    const { title, releaseDate, rating, posterPath, genres, overview } = this.props
    const shortOverview = this.shortenText(overview, 250)
    let data = ''
    if (releaseDate) {
      data = format(releaseDate, 'PP')
    }
    return (
      <div className="MovieItem">
        <div className="MoviePoster">
          <Image width={183} height={281} src={posterPath} />

          {/* <img src={posterPath} alt={title} /> */}
        </div>
        <div className="MovieDetails">
          <h2 className="Title">{title}</h2>
          <span className="ReleaseDate">{data}</span>
          <span className="Genres">{genres}</span>
          <span className="Overview">{shortOverview}</span>
          {/* <p>Rating: {rating}</p> */}
          {/* Include additional movie details here */}
        </div>
      </div>
    )
  }
}
