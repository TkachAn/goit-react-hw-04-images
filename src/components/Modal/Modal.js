import { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const Modal = ({ children, onToggleModal }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
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
      <div className={css.modal}>{children}</div>
    </div>
  );
};

Modal.propTypes = {
  onToggleModal: PropTypes.func.isRequired,
};

export default Modal;
