import { useState } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

function Searchbar({ onSearch, inputChange }) {
  const [formQuery, setFormQuery] = useState('');
  /**/
  const handleChange = e => {
    if (e.target.value === '') {
      setFormQuery('');
      inputChange(false, '2649311');
    } else {
      setFormQuery(e.target.value);
      inputChange(true, '2840235');
    }
  };

  /**/
  const handleSubmit = e => {
    e.preventDefault();
    if (!formQuery.trim()) return;
    onSearch(formQuery);
  };

  return (
    <header className={css.Searchbar}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.label}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          name="query"
          value={formQuery}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
};

export default Searchbar;
