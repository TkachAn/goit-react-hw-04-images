import PropTypes from 'prop-types';
import css from './Button.module.css';

function Button({ onLoadMore }) {
  return (
    <div className={css.button}>
      <button type={css.btn} className={css.btn} onClick={onLoadMore}>
        Load more
      </button>
    </div>
  );
}

Button.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
};

export default Button;
