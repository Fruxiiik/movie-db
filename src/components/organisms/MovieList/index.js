// В MovieList.js
import React, { Component } from 'react'
import { List, Card } from 'antd'

import { MovieItem } from '../MovieItem'

import './MovieList.css'

export class MovieList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { moviesData, children } = this.props
    if (!moviesData) {
      return <List>{children}</List>
    }
    return (
      <List
        className="MovieList"
        grid={{
          gutter: 36,
          column: 2,
        }}
        dataSource={moviesData}
        renderItem={(item) => (
          <List.Item>
            <MovieItem
              id={item.id}
              title={item.title}
              releaseDate={item.releaseDate}
              rating={item.rating}
              posterPath={item.posterPath}
              genres={item.genres.join(', ')}
              overview={item.overview}
            />
          </List.Item>
        )}
        // style={{ padding: '0 36px' }}
      />
    )
  }
}
