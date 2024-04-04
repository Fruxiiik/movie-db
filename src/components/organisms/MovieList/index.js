import React, { Component } from 'react'
import { List } from 'antd'

import { MovieItem } from '../MovieItem'

import './MovieList.css'

export class MovieList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnCount: 2,
    }
  }

  componentDidMount() {
    this.updateColumnCount()
    window.addEventListener('resize', this.updateColumnCount)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColumnCount)
  }

  updateColumnCount = () => {
    const columnCount = window.innerWidth < 600 ? 1 : 2
    this.setState({ columnCount })
  }

  render() {
    const { handleRatingChange, moviesData, children } = this.props
    const { columnCount } = this.state

    if (!moviesData) {
      return <List>{children}</List>
    }
    return (
      <List
        className="MovieList"
        grid={{
          gutter: 36,
          column: columnCount,
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
              genreIds={item.genreIds}
              overview={item.overview}
              handleRatingChange={handleRatingChange}
            />
          </List.Item>
        )}
      />
    )
  }
}
