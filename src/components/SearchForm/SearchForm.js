import React from 'react';

const SearchForm = ({ searchKeyword, onSearch, isSearching, handleSearch }) => {
  return (
    <div>
      <input
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