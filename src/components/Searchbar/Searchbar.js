import { useState } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

function Searchbar({ onSearch, findImageId }) {
  const [formQuery, setFormQuery] = useState('');
  /**/
  const handleChange = e => {
    if (e.target.value === '') {
      findImageId('2649311');
      setFormQuery('');
    } else {
      findImageId('2840235');
      setFormQuery(e.target.value);
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
  findImageId: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Searchbar;
