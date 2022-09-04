import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

function Searchbar({ onHandleSubmit, onSearchQueryChange, value }) {
  return (
    <header className={css.Searchbar}>
      <form className={css.form} onSubmit={onHandleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.label}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          value={value}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={onSearchQueryChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Searchbar;
