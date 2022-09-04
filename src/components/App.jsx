import { Component, useState, useEffect } from 'react';
import { apiPixabay, apiPixabayId } from '../apiPixabay/apiPixabay';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import ErrorView from './ErrorView/ErrorView';
import PreLoad from './preLoad/preLoad';

const App = () => {
  const [query, setQuery] = useState('');
  const [pag, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [startImageURL, setStartImageURL] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('idle');
};
/*
import { Component } from 'react';
import { apiPixabay, apiPixabayId } from '../apiPixabay/apiPixabay';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import ErrorView from './ErrorView/ErrorView';
import PreLoad from './preLoad/preLoad';
*/
/*
class App extends Component {
  state = {
    query: '',
    images: [],
    largeImageURL: '',
    startImageURL: '',
    page: 1,
    error: null,
    showModal: false,
    status: 'idle',
  };
*/
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ images: [], page: 1, error: null });
    }
    if (prevState.page !== this.state.page) {
      this.searchImages();
    }
  }

  searchImages = async () => {
    const { query, page } = this.state;
    this.setState({ status: 'pending' });
    try {
      const request = await apiPixabay(query, page);
      this.scrollPage();
      this.setState(({ images }) => ({
        images: [...images, ...request],
        status: 'resolved',
      }));
      if (request.length === 0 || request === '') {
        this.setState({
          error: `No results were found for ${query}!`,
          status: 'rejected',
        });
        this.findImageId('3082831');
      }
    } catch (error) {
      this.setState({ error: 'Something went wrong. Try again.' });
    } finally {
    }
  };

  findImageId = async id => {
    try {
      const request = await apiPixabayId(id);
      this.setState(() => ({
        startImageURL: request[0].largeImageURL,
      }));
      if (request.length === 0) {
        this.setState({
          error: `No results were found for ${id}!`,
          status: 'rejected ',
        });
      }
    } catch (error) {
      this.setState({ error: 'Something went wrong. Try again.' });
    } finally {
      // this.setState({ isLoading: false });
    }
  };

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.searchImages();
  };

  onLoadMore = () => {
    this.setState({ status: 'pending' });
    this.setState(({ page }) => ({
      page: page + 1,
      status: 'resolved',
    }));

    console.log(this.state.page);
  };

  onOpenModal = e => {
    this.setState({ largeImageURL: e.target.dataset.source });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(state => ({
      showModal: !state.showModal,
    }));
  };
  componentDidMount() {
    this.findImageId('2649311');
  }
  scrollPage = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight * 5,
        behavior: 'smooth',
      });
    }, 500);
  };

  render() {
    const {
      query,
      images,
      largeImageURL,
      startImageURL,
      showModal,
      error,
      status,
    } = this.state;

    if (status === 'idle') {
      return (
        <>
          <Searchbar
            onHandleSubmit={this.handleSubmit}
            onSearchQueryChange={this.handleChange}
            value={query}
          />
          <PreLoad src={startImageURL} />
        </>
      );
    }

    if (status === 'pending') {
      return (
        <>
          <Searchbar
            onHandleSubmit={this.handleSubmit}
            onSearchQueryChange={this.handleChange}
            value={query}
          />
          <ImageGallery
            images={images}
            onOpenModal={this.onOpenModal}
            searchImages={this.searchImages}
          />
          <Loader />
        </>
      );
    }

    if (status === 'rejected') {
      return (
        <>
          <Searchbar
            onHandleSubmit={this.handleSubmit}
            onSearchQueryChange={this.handleChange}
            value={query}
          />
          <ErrorView texterror={error} src={startImageURL} />
        </>
      );
    }

    if (status === 'resolved') {
      return (
        <>
          <Searchbar
            onHandleSubmit={this.handleSubmit}
            onSearchQueryChange={this.handleChange}
            value={query}
          />
          <ImageGallery images={images} onOpenModal={this.onOpenModal} />
          {images.length >= 12 && <Button onLoadMore={this.onLoadMore} />}

          {showModal && (
            <Modal
              largeImageURL={largeImageURL}
              onToggleModal={this.toggleModal}
            />
          )}
        </>
      );
    }
  }
}

export default App;
