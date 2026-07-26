import PropTypes from 'prop-types';
import css from './preLoad.module.css';

function PreLoad({
  src,
  alt = 'fingers up',
  title = 'Please enter a value for search images!',
}) {
  return (
    <div className= {css.box} >
      <h2 className={css.text}>{title}</h2>
      <div className={css.tumb}>
        <img className={css.image} src={src} alt={alt} />
      </div>
    </div>
  );
}
PreLoad.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
};
export default PreLoad;
