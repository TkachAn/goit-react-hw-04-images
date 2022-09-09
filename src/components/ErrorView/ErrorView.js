import PropTypes from 'prop-types';

import css from './ErrorView.module.css';

function ErrorView({ textError, src }) {
  return (
    <div role="alert" className={css.wrapper}>
      <h2 text={textError} className={css.text}>
        {textError}
      </h2>
      <img className={css.image} src={src} alt="sadcat" />
    </div>
  ); //width="550"
}

ErrorView.propTypes = {
  textError: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default ErrorView;
