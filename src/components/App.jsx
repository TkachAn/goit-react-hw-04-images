import { useState, useEffect } from 'react';
import { apiPixabay, apiPixabayId } from '../apiPixabay/apiPixabay';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import ErrorView from './ErrorView/ErrorView';
import PreLoad from './preLoad/preLoad';

const App = () => {
  /**/
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [startImageURL, setStartImageURL] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('idle');
  console.log('status', status);
  /**/
  useEffect(() => {
    findImageId('2649311');
  }, []);
  /**/
  useEffect(() => {
    if (page === 1) {
      return;
    }
    console.log('searchImages', 'useEffectP');
    searchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  /**/
  const searchImages = async () => {
    // const { query, page } = this.state;
    setStatus('pending');
    try {
      const request = await apiPixabay(query, page);
      scrollPage();
      setImages(prev => [...prev, ...request]);
      setStatus('resolved');
      console.log('TRY', 'useEffectQ');
      if (request.length === 0 || request === '') {
        setStatus('rejected');
        setError(`No results were found for ${query}!`);
        findImageId('3082831');
      }
    } catch (error) {
      setError('Something went wrong. Try again.');
      findImageId('2840281');
    } finally {
    }
  };
  /**/
  const findImageId = async id => {
    try {
      const request = await apiPixabayId(id);
      setStartImageURL(request[0].largeImageURL);
      console.log('TRY', 'useEffectP');
      if (request.length === 0) {
        setStatus('rejected');
        setError(`No results were found for ${id}!`);
      }
    } catch (error) {
      setError('Something went wrong.');
    } finally {
    }
  };
  /**/
  const handleChange = e => {
    setQuery(e.target.value);
    if (e.target.value === '') {
      setStatus('idle');
      findImageId('2649311');
      console.log('findImageId', '2649311');
    } else {
      findImageId('2840235');
    }
  };
  /**/
  const handleSubmit = e => {
    e.preventDefault();
    // setStatus('idle');
    setError(null);
    setImages([]);
    setPage(1);
    if (query === '') {
      findImageId('2649311');
      return;
    } else {
      console.log('searchImages', 'useEffectQ');
      searchImages();
    }
  };
  /**/
  const onLoadMore = () => {
    //setStatus('pending');
    setPage(page + 1);
    //setStatus('resolved');

    console.log(page);
  };
  /**/
  const onOpenModal = e => {
    setLargeImageURL(e.target.dataset.source);
    toggleModal();
  };
  /**/
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  /**/
  const scrollPage = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight * 5,
        behavior: 'smooth',
      });
    }, 500);
  };
  /**/
  if (status === 'idle') {
    return (
      <>
        <Searchbar
          onHandleSubmit={handleSubmit}
          onSearchQueryChange={handleChange}
          value={query}
        />
        <PreLoad src={startImageURL} />
      </>
    );
  }
  /** */
  if (status === 'pending') {
    return (
      <>
        <Searchbar
          onHandleSubmit={handleSubmit}
          onSearchQueryChange={handleChange}
          value={query}
        />
        <ImageGallery
          images={images}
          onOpenModal={onOpenModal}
          searchImages={searchImages}
        />
        <Loader />
      </>
    );
  }
  /** */
  if (status === 'rejected') {
    return (
      <>
        <Searchbar
          onHandleSubmit={handleSubmit}
          onSearchQueryChange={handleChange}
          value={query}
        />
        <ErrorView texterror={error} src={startImageURL} />
      </>
    );
  }
  /** */
  if (status === 'resolved') {
    return (
      <>
        <Searchbar
          onHandleSubmit={handleSubmit}
          onSearchQueryChange={handleChange}
          value={query}
        />
        <ImageGallery images={images} onOpenModal={onOpenModal} />
        {images.length >= 12 && <Button onLoadMore={onLoadMore} />}

        {showModal && (
          <Modal largeImageURL={largeImageURL} onToggleModal={toggleModal} />
        )}
      </>
    );
  }
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
/*
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ images: [], page: 1, error: null });
    }
    if (prevState.page !== this.state.page) {
      this.searchImages();
    }
  }
*/
/*
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
*/
/*
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
*/
/*
  handleChange = e => {
    this.setState({ query: e.target.value });
  };
*/
/*
  handleSubmit = e => {
    e.preventDefault();
    this.searchImages();
  };
*/
/*
  onLoadMore = () => {
    this.setState({ status: 'pending' });
    this.setState(({ page }) => ({
      page: page + 1,
      status: 'resolved',
    }));

    console.log(this.state.page);
  };
*/
/*
  onOpenModal = e => {
    this.setState({ largeImageURL: e.target.dataset.source });
    this.toggleModal();
  };
*/
/*
  toggleModal = () => {
    this.setState(state => ({
      showModal: !state.showModal,
    }));
  };
	*/
/*
  componentDidMount() {
    this.findImageId('2649311');
  }
	*/
/*
  scrollPage = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight * 5,
        behavior: 'smooth',
      });
    }, 500);
  };
*/
//   render() {
//     const {
//       query,
//       images,
//       largeImageURL,
//       startImageURL,
//       showModal,
//       error,
//       status,
//     } = this.state;

//     if (status === 'idle') {
//       return (
//         <>
//           <Searchbar
//             onHandleSubmit={this.handleSubmit}
//             onSearchQueryChange={this.handleChange}
//             value={query}
//           />
//           <PreLoad src={startImageURL} />
//         </>
//       );
//     }

//     if (status === 'pending') {
//       return (
//         <>
//           <Searchbar
//             onHandleSubmit={this.handleSubmit}
//             onSearchQueryChange={this.handleChange}
//             value={query}
//           />
//           <ImageGallery
//             images={images}
//             onOpenModal={this.onOpenModal}
//             searchImages={this.searchImages}
//           />
//           <Loader />
//         </>
//       );
//     }

//     if (status === 'rejected') {
//       return (
//         <>
//           <Searchbar
//             onHandleSubmit={this.handleSubmit}
//             onSearchQueryChange={this.handleChange}
//             value={query}
//           />
//           <ErrorView texterror={error} src={startImageURL} />
//         </>
//       );
//     }

//     if (status === 'resolved') {
//       return (
//         <>
//           <Searchbar
//             onHandleSubmit={this.handleSubmit}
//             onSearchQueryChange={this.handleChange}
//             value={query}
//           />
//           <ImageGallery images={images} onOpenModal={this.onOpenModal} />
//           {images.length >= 12 && <Button onLoadMore={this.onLoadMore} />}

//           {showModal && (
//             <Modal
//               largeImageURL={largeImageURL}
//               onToggleModal={this.toggleModal}
//             />
//           )}
//         </>
//       );
//     }
//   }
// }

export default App;
