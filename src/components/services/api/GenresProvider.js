import React, { Component } from 'react'

import { GenresContext } from './GenresContext'
import MovieApiClient from './movie-api-client'

export class GenresProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      genres: [],
    }
  }

  componentDidMount() {
    this.fetchGenres()
  }

  fetchGenres = async () => {
    const movieApiClient = new MovieApiClient()
    const genresData = await movieApiClient.getGenres()
    this.setState({ genres: genresData })
  }

  render() {
    return <GenresContext.Provider value={this.state}>{this.props.children}</GenresContext.Provider>
  }
}
