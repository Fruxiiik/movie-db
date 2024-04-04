import React, { Component } from 'react'
import { debounce } from 'lodash'

import { MovieList, Pagination, Search, Tabs } from './components/organisms'
import MovieApiClient from './components/services/api/movie-api-client'
import { GenresProvider } from './components/services/api/GenresProvider'
import Spinner from './components/organisms/Spinner'
import ErrorIndicator from './components/organisms/ErrorIndicator'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'search',
      inputValue: '',
      currentPage: 1,
      currentRatedPage: 1,
      totalItems: 0,
      moviesData: [],
      ratedMovies: [],
      loading: true,
      loadingRated: true,
      errorMessage: '',
      errorType: '',
      guestSessionId: '',
    }
    this.movieApiClient = new MovieApiClient()
    this.debouncedSearch = debounce(this.fetchMovies, 500)
  }

  componentDidMount() {
    const guestId = localStorage.getItem('guestSessionId')
    if (guestId) {
      this.setState({ guestSessionId: guestId })
    } else {
      this.movieApiClient.guestSession().then((body) => {
        const sessionId = body.guest_session_id
        this.setState({ guestSessionId: sessionId }, () => {
          // Сохраняем guestSessionId в localStorage
          localStorage.setItem('guestSessionId', sessionId)
        })
      })
    }
    this.handleNetworkChange() // Проверяем состояние сети при монтировании
    window.addEventListener('online', this.handleNetworkChange)
    window.addEventListener('offline', this.handleNetworkChange)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange)
    window.removeEventListener('offline', this.handleNetworkChange)
  }

  handleNetworkChange = () => {
    const status = navigator.onLine ? 'online' : 'offline'
    const { currentPage, inputValue } = this.state
    if (navigator.onLine && inputValue) {
      this.setState({ errorMessage: '' }, () => this.fetchMovies(inputValue, currentPage))
    } else {
      this.setState({ errorMessage: 'Нет соединения с интернетом.' })
    }
  }

  handleTabChange = (activeKey) => {
    const { guestSessionId } = this.state
    this.setState({ activeTab: activeKey }, () => {
      if (activeKey === 'rated') {
        this.getRatedMovies(guestSessionId, this.state.currentRatedPage || 1)
      }
    })
  }

  fetchMovies = (input, page) => {
    this.setState({ loading: true, errorMessage: '', errorType: null })

    this.movieApiClient
      .getSearchMovies(input, page)
      .then(({ movies, totalResults }) => {
        if (movies.length === 0) {
          this.setState({
            errorMessage: 'Фильмы по запросу не найдены.',
            loading: false,
            errorType: 'noResults',
            inputValue: input,
          })
        } else {
          this.setState({
            moviesData: movies,
            currentPage: page,
            totalItems: totalResults,
            loading: false,
            errorType: null,
          })
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.message || 'Произошла ошибка при загрузке данных.',
          loading: false,
          errorType: 'fetchError',
        })
      })
  }

  handleChangePage = (page) => {
    const { activeTab, inputValue, guestSessionId } = this.state
    window.scrollTo(0, 0)
    if (activeTab === 'search') {
      this.setState({ currentPage: page }, () => this.fetchMovies(inputValue, page))
    } else if (activeTab === 'rated') {
      this.setState({ currentRatedPage: page }, () => this.getRatedMovies(guestSessionId, page))
    }
  }

  handleChangeInput = (text) => {
    this.setState(
      {
        inputValue: text,
        currentPage: 1,
      },
      () => {
        const { currentPage, inputValue } = this.state
        if (inputValue.length !== 0) {
          this.debouncedSearch(inputValue, currentPage)
        }
      }
    )
  }

  handleRetry = () => {
    const { inputValue, currentPage, currentRatedPage, guestSessionId } = this.state
    if (this.state.errorType === 'fetchError') {
      this.fetchMovies(inputValue, currentPage)
    } else if (this.state.errorType === 'noResults') {
      this.debouncedSearch(inputValue, currentPage)
    } else if (this.state.errorType === 'noResultsRated' || this.state.errorType === 'fetchErrorRated') {
      this.getRatedMovies(guestSessionId, currentRatedPage)
    }
  }

  handleRatingChange = (movieId, ratingValue) => {
    const { guestSessionId } = this.state
    this.movieApiClient
      .sendRatingValue(guestSessionId, movieId, ratingValue)
      .then(() => {
        this.getRatedMovies(guestSessionId, 1)
      })
      .catch(console.error)
  }

  getRatedMovies = (guestSessionId, page) => {
    this.setState({ loadingRated: true, errorMessage: '', notificationType: null })
    this.movieApiClient
      .getRatedMovies(guestSessionId, page)
      .then(({ movies, totalResults }) => {
        if (movies.length === 0) {
          this.setState({
            errorMessage: 'Оцененных фильмов нет',
            loadingRated: false,
            errorType: 'noResultsRated',
          })
        } else {
          this.setState({
            ratedMovies: movies,
            currentRatedPage: page,
            totalRatedItems: totalResults,
            loadingRated: false,
            errorType: null,
          })
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: 'Произошла ошибка при загрузке данных. Возможно у вас еще нет оцененных фильмов',
          loadingRated: false,
          errorType: 'fetchErrorRated',
        })
      })
  }

  renderContent() {
    const {
      activeTab,
      inputValue,
      moviesData,
      currentPage,
      currentRatedPage,
      totalItems,
      totalRatedItems,
      loading,
      loadingRated,
      errorMessage,
      errorType,
    } = this.state
    if (activeTab === 'search' && loading) {
      return (
        <>
          <Search search={this.handleChangeInput} inputValue={inputValue} />
          <Spinner />
        </>
      )
    }

    if (errorType === 'fetchError' || errorType === 'noResults') {
      return (
        <>
          <Search search={this.handleChangeInput} inputValue={inputValue} />
          <ErrorIndicator retry={this.handleRetry} errorMessage={errorMessage} />
        </>
      )
    }

    if (activeTab === 'search') {
      return (
        <>
          <Search search={this.handleChangeInput} inputValue={inputValue} />
          <MovieList moviesData={moviesData} handleRatingChange={this.handleRatingChange} />
          <Pagination current={currentPage} onChangePage={this.handleChangePage} total={totalItems} />
        </>
      )
    }
    if (activeTab === 'rated' && loadingRated) {
      return <Spinner />
    }

    if (activeTab === 'rated') {
      const { ratedMovies } = this.state
      if (errorType === 'fetchErrorRated' || errorType === 'noResultsRated') {
        return <ErrorIndicator retry={this.handleRetry} errorMessage={errorMessage} type="warning" />
      }
      return (
        <>
          <MovieList moviesData={ratedMovies} handleRatingChange={this.handleRatingChange} />
          <Pagination current={currentRatedPage} onChangePage={this.handleChangePage} total={totalRatedItems} />
        </>
      )
    }
  }

  render() {
    return (
      <GenresProvider>
        <div className="Body flex-column">
          <Tabs onChange={this.handleTabChange} />
          {this.renderContent()}
        </div>
      </GenresProvider>
    )
  }
}
