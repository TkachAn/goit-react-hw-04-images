import { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const Modal = ({ children, onToggleModal }) => {
  //, largeImageURL
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  // console.log('largeImageURLM2', largeImageURL);
  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onToggleModal();
    }
  };

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onToggleModal();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        {children}
        {/* <img
          className={css.image}
          src={largeImageURL}
          alt="largeImage"
          onClick={handleBackdropClick}
        /> */}
      </div>
    </div>
  );
};

export default Modal;
