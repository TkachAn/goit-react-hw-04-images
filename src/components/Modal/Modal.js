import { useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const Modal=(onToggleModal)=> {
  // static propTypes = {
  //   largeImageURL: PropTypes.string.isRequired,
  //   onToggleModal: PropTypes.func.isRequired,
  // };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      props.onToggleModal();
    }
  };

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      props.onToggleModal();
    }
  };

  render() {
    const { largeImageURL } = this.props;

    return (
      <div className={css.backdrop} onClick={this.handleBackdropClick}>
        <div className={css.modal}>
          <img
            className={css.image}
            src={largeImageURL}
            alt="largeImage"
            onClick={this.handleBackdropClick}
          />
        </div>
      </div>
    );
  }
}

export default Modal;
