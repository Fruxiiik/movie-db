import React, { Component } from 'react'
import { Rate as AntdRate } from 'antd'

import './MovieRatingValue.css'

export class MovieRatingValue extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onChange = (ratingValue) => {
    this.props.updateRating(ratingValue)
    const { handleRatingChange } = this.props
    handleRatingChange(ratingValue)
  }

  render() {
    const { rating } = this.props
    return (
      <div className="MovieRatingValue">
        <AntdRate allowHalf count={10} defaultValue={rating || 0} onChange={this.onChange} />
      </div>
    )
  }
}
