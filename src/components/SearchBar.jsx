
import React, { useState, useRef, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';

const SearchBar = ({ spotify, selected, setSelected }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false)

  const getSuggestions = (value) => {
    setLoading(true);
    spotify.search(value)
      .then(data => {
        setSuggestions(data.tracks.items);
        setLoading(false);
      })
  };

  const debouncedRef = useRef();
  debouncedRef.current = (value) => getSuggestions(value);
  const debouncedGetSuggestions = useCallback(debounce((value) => debouncedRef.current(value), 500), []);

  const clearSuggestions = () => setSuggestions([]);

  const getSuggestionValue = ({ name, artists }) => `${name} - ${artists.map(a => a.name).join(", ")}`;

  const renderSuggestion = ({ name, artists }) => (
    <div>
      <p>{name} - {artists.map(a => a.name).join(", ")}</p>
    </div>
  );

  const shouldRenderSuggestions = (value) => value.trim().length > 2;

  const onSuggestionSelected = (e, { suggestion }) => {
    const tracks = [...selected];
    tracks.push(suggestion);
    setSelected(tracks);
    setValue("");
  }

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
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        onSuggestionSelected={onSuggestionSelected}
      />
    </div>
  )
}

export default SearchBar;
