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
  // console.log('status', status);
  /**/
  useEffect(() => {
    findImageId('2649311');
  }, []);
  /**/
  useEffect(() => {
    if (page === 1) {
      return;
    } else {
      searchImages();
      console.log('pageU', page);
    }
  }, [page]);
  useEffect(() => {
    if (query === '') return;
    searchImages();
    console.log('queryU', query);
  }, [query]);
  /**/
  const searchImages = async () => {
    setStatus('pending');
    try {
      const request = await apiPixabay(query, page);
      if (page > 1) scrollPage();
      console.log('pageQ', page);
      setImages(prev => [...prev, ...request]);
      setStatus('resolved');
      if (request.length === 0 || request === '') {
        findImageId('3082831');
        setStatus('rejected');
        setError(`No results were found for ${query}!`);
      }
    } catch (error) {
      findImageId('2840281');
      setStatus('rejected');
      setError('Something went wrong. Try again.');
    } finally {
    }
  };
  /**/
  const findImageId = async id => {
    try {
      const request = await apiPixabayId(id);
      setStartImageURL(request[0].largeImageURL);
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
    } else {
      findImageId('2840235');
    }
  };
  /**/
  const handleSubmit = e => {
    e.preventDefault();
    setError(null);
    setImages([]);
    setPage(1);
    if (query === '') {
      findImageId('2649311');
      return;
    }
    const q = e.currentTarget.value;
    console.log('q', q);
    setQuery(q);
    // searchImages();
  };
  /**/
  const onLoadMore = () => {
    setStatus('pending');
    setPage(page + 1);
  };
  /**/
  const onOpenModal = e => {
    setStatus('pending');
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
        top: document.documentElement.clientHeight * 2,
        behavior: 'smooth',
      });
    }, 500);
    setStatus('resolved');
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
export default App;
