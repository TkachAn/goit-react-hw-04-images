import PropTypes from 'prop-types';

import css from './ErrorView.module.css';

function ErrorView({ texterror, src }) {
  return (
    <div role="alert" className={css.wrapper}>
      <h2 text={texterror} className={css.text}>
        {texterror}
      </h2>
      <img className={css.image} src={src} alt="sadcat" />
    </div>
  ); //width="550"
}

ErrorView.propTypes = {
  texterror: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default ErrorView;
