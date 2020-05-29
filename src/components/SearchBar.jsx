
import React, { memo, useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import Autosuggest from 'react-autosuggest';
import { CSSTransition } from 'react-transition-group';
import debounce from 'lodash/debounce';

import { colors, easeOutExpo } from '../theme';

const Container = styled.div`
  z-index: 1;
  max-width: 100%;

  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__suggestions-list {
    list-style: none;
  }

  .react-autosuggest__suggestion--highlighted {
    background: ${colors.light};
  }
`

const Bar = styled.div`
  position: relative;
  height: 50px;
  width: ${props => props.focused ? '520px' : '260px'};
  max-width: 100%;
  padding: .4em 1em;
  border-radius: ${props => props.focused ? '1em' : '2em'};
  background: ${props => props.focused ? colors.white : colors.dark3};
  color: ${colors.dark};
  transition: all .8s ${easeOutExpo}, background .5s ${easeOutExpo};
  z-index: 1;
  /* overflow: hidden; */

  .searchBarButton-enter {
    opacity: 0;
  }

  .searchBarButton-enter-active {
    opacity: 1;
    transition: opacity .5s ${easeOutExpo};
  }

  .searchBarButton-exit {
    opacity: 1;
  }

  .searchBarButton-exit-active {
    opacity: 0;
    transition: opacity .5s ${easeOutExpo};
  }
`

const Input = styled.input`
  position: relative;
  height: 100%;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  background: transparent;
  color: inherit;

  &:focus {
    outline-width: 0;
  }
`

const SearchBarButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 2em;
  background: ${colors.dark3};
  color: ${colors.white};
  cursor: pointer;
  transition: all 0.5s ${easeOutExpo};

  &:hover {
    transform: scale(1.05);
  }
`

const Suggestions = styled.div`
  position: absolute;
  top: 50%;
  width: ${props => props.focused ? '520px' : '260px'};
  max-width: 100%;
  padding: calc(50px / 2) 0 .5em;
  border-radius: ${props => props.focused ? '1em' : '2em'};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  opacity: 1;
  background: ${colors.white};
  color: ${colors.dark};
  overflow: scroll;
  transition: all .8s ${easeOutExpo};

  &:empty {
    opacity: 0;
    padding-bottom: 0;
  }
`

const Result = styled.div`
  display: flex;
  align-items: center;
  min-height: 50px;
  width: 100%;
  padding: 4px .5em;
  cursor: pointer;
`

const Artwork = styled.img`
  height: 50px;
  margin: 0 8px 0 4px;
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: .7em;
    color: ${colors.dark2};
  }
`

const SearchBar = ({ spotify, selected, setSelected, expand, setExpand, ...props }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const barRef = useRef();

  const getSuggestions = (value) => {
    spotify.search(value)
      .then(data => setSuggestions(data.tracks.items))
  };

  const debouncedRef = useRef();
  debouncedRef.current = (value) => getSuggestions(value);
  const debouncedGetSuggestions = useCallback(debounce((value) => debouncedRef.current(value), 500), []);

  const clearSuggestions = () => setSuggestions([]);

  const getSuggestionValue = ({ name, artists }) => `${name} - ${artists.map(a => a.name).join(", ")}`;

  const renderSuggestion = ({ name, artists, album: { images }}) => {
    const imageURL = images[2].url;
    return (
      <Result>
        <Artwork src={imageURL} alt={`Album artwork for ${name}`}/>
        <Details>
          <p>{name}</p>
          <span>by {artists.map(a => a.name).join(", ")}</span>
        </Details>
      </Result>
    )
  };

  const shouldRenderSuggestions = (value) => value.trim().length > 2;

  const onSuggestionSelected = (_, { suggestion }) => {
    // Don't allow duplicate tracks
    if (selected.map(t => t.id).indexOf(suggestion.id) === -1) {
      setSelected([...selected, suggestion]);
    }
    setValue("");
  }

  const inputProps = {
    value,
    ref: barRef,
    placeholder: 'Search for a song!',
    onChange: (e, { newValue }) => setValue(newValue),
    onFocus: () => setExpand(true)
  }

  const renderInputComponent = (inputProps) => (
    <Bar focused={expand}>
      <Input {...inputProps}/>
      <CSSTransition in={!expand} unmountOnExit timeout={500} classNames="searchBarButton">
        <SearchBarButton onClick={() => { setExpand(true); barRef.current.focus() }}>
          Search for songs!
        </SearchBarButton>
      </CSSTransition>
    </Bar>
  );

  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <Suggestions focused={expand} {...containerProps}>
      {children}
    </Suggestions>
  );

  return (
    <Container {...props}>
      <Autosuggest
        suggestions={suggestions}
        inputProps={inputProps}
        onSuggestionsFetchRequested={({ value }) => debouncedGetSuggestions(value)}
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        onSuggestionSelected={onSuggestionSelected}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
      />
    </Container>
  )
}

export default memo(SearchBar);
