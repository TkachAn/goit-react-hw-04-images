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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    findImageId('2649311');
  }, []);
  useEffect(() => {
    if (query === '') {
      return;
    } else {
      searchImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  useEffect(() => {
    setShowModal(false);
    setLargeImageURL('');
    if (!emptyInput) {
      setStatus('idle');
      setImages([]);
      setPage(1);
      setError('');
      findImageId('2649311');
    } else {
      if (status === 'idle') {
        findImageId('2840235');
      }
      if (status === 'rejected') {
        setImages([]);
        setPage(1);
        findImageId('2681507');
      }
    }
  }, [emptyInput, status]);

  const inputChange = bool => {
    setEmptyInput(bool);
  };
  /**/
  const searchImages = async () => {
    try {
      const request = await apiPixabay(query, page);
      if (page > 1) scrollPage();
      console.log('pageQ', page);
      setImages(prev => [...prev, ...request]);
      setStatus('resolved');
      if (request.length === 0 || request === '') {
        setStatus('rejected');
        setError(`No results were found for ${query}!`);
      }
    } catch (error) {
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
  const SearchForm = query => {
    setImages([]);
    setPage(1);
    setError(null);
    setShowModal(false);
    setLargeImageURL('');
    setQuery(query);
  };
  /**/
  const onLoadMore = () => {
    setStatus('pending');
    setPage(page + 1);
  };
  /**/
  const onOpenModal = e => {
    setLargeImageURL(e.target.dataset.source);
    setShowModal(true);
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
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        <PreLoad src={startImageURL} />
      </>
    );
  }
  /** */
  if (status === 'pending') {
    return (
      <>
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        {page > 1 && (
          <ImageGallery
            images={images}
            onOpenModal={onOpenModal}
            searchImages={searchImages}
          />
        )}
        <Loader />
      </>
    );
  }
  /**/
  if (status === 'rejected') {
    return (
      <>
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        <ErrorView textError={error} src={startImageURL} />
      </>
    );
  }
  /**/
  if (status === 'resolved') {
    return (
      <>
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        <ImageGallery images={images} onOpenModal={onOpenModal} />
        {images.length >= 12 && <Button onLoadMore={onLoadMore} />}

        {showModal && (
          <Modal onToggleModal={toggleModal}>
            <img src={largeImageURL} alt="largeImageURL" />
          </Modal>
        )}
      </>
    );
  }
};
export default App;
/**/
