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
  const [emptyInput, setEmptyInput] = useState(false);
  const [status, setStatus] = useState('idle');
  console.log('status', status);
  console.log('startImageURL', startImageURL);
  // console.log('showModal', showModal);
  // console.log('error', error);
  // console.log('largeImageURL', largeImageURL);
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
    }
  }, [page]);

  useEffect(() => {
    if (query === '') {
      findImageId('2649311');
      return;
    } else {
      searchImages();
    }
  }, [query]);

  // useEffect(() => {
  //   console.log(startImageURL);
  // }, [startImageURL]);

  const inputChange = (bool, id) => {
    setEmptyInput(bool);
    setStartImageURL(id);
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
        findImageId('3082831');
        setStatus('rejected');
        setError(`No results were found for ${query}!`);
      }
    } catch (error) {
      findImageId('2840281');
      setStatus('rejected');
      setError('Something went wrong. Try again.');
    } finally {
      console.log('pageQU', page);
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
      console.log('pageID', page);
    }
  };

  /**/
  const SearchForm = query => {
    // setStatus('idle');
    setStatus('pending');
    setImages([]);
    setPage(1);
    setError(null);
    setShowModal(false);
    setLargeImageURL('');
    if (query === '') {
      findImageId('2649311');
      return;
    }
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
        <Searchbar
          onSearch={SearchForm}
          findImageId={findImageId}
          // value={query}
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
          onSearch={SearchForm}
          findImageId={findImageId}
          // value={query}
        />
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
  /** */
  if (status === 'rejected') {
    return (
      <>
        <Searchbar
          onSearch={SearchForm}
          findImageId={findImageId}
          // value={query}
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
          onSearch={SearchForm}
          findImageId={findImageId}
          // value={query}
        />
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
// const handleSubmit = e => {
//   e.preventDefault();
//   setError(null);
//   setImages([]);
//   setPage(1);
//   if (query === '') {
//     findImageId('2649311');
//     return;
//   }
//   const q = e.currentTarget.value;
//   console.log('q', q);
//   setQuery(q);
//   // searchImages();
// };
/**/
// const handleChange = e => {
//   setQuery(e.target.value);
//   if (e.target.value === '') {
//     setStatus('idle');
//     findImageId('2649311');
//   } else {
//     findImageId('2840235');
//   }
// };
//largeImageURL={largeImageURL}
