
import React from 'react';
import SearchBar from '../components/SearchBar';

const Search = ({ spot }) => {


  return (
    <div>
      <h1>Search!</h1>
      <SearchBar spot={spot}/>
    </div>
  )
}

export default Search;
