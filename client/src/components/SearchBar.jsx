
import React, { useState, useRef, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';

const SearchBar = ({ spot }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false)

  const getSuggestions = (value) => {
    setLoading(true);
    spot.search(value, ['track'], { limit: 10 })
      .then(data => {
        setSuggestions(data.tracks.items);
        setLoading(false);
      })
  };

  const debouncedRef = useRef();
  debouncedRef.current = (value) => getSuggestions(value);
  const debouncedGetSuggestions = useCallback(debounce((value) => debouncedRef.current(value), 500), []);

  const renderSuggestion = ({ name, artists }) => (
    <div>
      <p>{name} - {artists.map(a => a.name).join(", ")}</p>
    </div>
  );

  const shouldRenderSuggestions = (value) => value.trim().length > 2;

  const inputProps = {
    value,
    placeholder: 'Search for a song!',
    onChange: (e, { newValue }) => setValue(newValue)
  }

  return (
    <div>
      <p>Status: {loading ? "Searching..." : "Done!"}</p>
      <Autosuggest
        suggestions={suggestions}
        inputProps={inputProps}
        onSuggestionsFetchRequested={({ value }) => debouncedGetSuggestions(value)}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
      />
    </div>
  )
}

export default SearchBar;
