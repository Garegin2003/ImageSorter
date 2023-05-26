import React from 'react';
import './SearchForm.css';

const SearchForm = ({ searchKeyword, onSearch, isSearching, handleSearch }) => {
  return (
    <div className="inp-div">
      <input
        className="inp"
        type="text"
        value={searchKeyword}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Enter a keyword"
      />
      <button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchForm;
