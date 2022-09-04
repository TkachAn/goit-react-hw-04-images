import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';

function ImageGalleryItem({
  id,
  webformatURL,
  largeImageURL,
  tags,
  onOpenModal,
}) {
  return (
    <li key={id} className={css.item}>
      <img
        src={webformatURL}
        alt={tags}
        data-source={largeImageURL}
        className={css.image}
        onClick={onOpenModal}
      />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  webformatURL: PropTypes.string.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
