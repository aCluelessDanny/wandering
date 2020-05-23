
import React, { useState } from 'react';
import styled from '@emotion/styled';

import SearchBar from '../components/SearchBar';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const Half = styled.div`
  flex: 1;
  height: 100%;
  overflow: scroll;
`

const Search = ({ spotify, focus, extractAndRecommend }) => {
  const [selected, setSelected] = useState([]);

  const removeTrack = (index) => {
    let tracks = [...selected];
    tracks.splice(index, 1);
    setSelected(tracks);
  }

  const SelectedTracks = () => (
    <ul>
      {selected.map(({ name, artists, album }, i) => (
        <li key={i} onClick={() => removeTrack(i)}>
          <p><b>{name}</b> - {artists.map(a => a.name).join(", ")} - {album.name}</p>
        </li>
      ))}
    </ul>
  )

  return (
    <Container>
      <SearchBar spotify={spotify} selected={selected} setSelected={setSelected} focus={focus}/>
      {/* <Half>
        <h1>Search!</h1>
        <div>
          <SearchBar spotify={spotify} selected={selected} setSelected={setSelected}/>
        </div>
      </Half>
      <Half>
        <div style={{ flex: 1 }}>
          <h2>Selected...</h2>
          <SelectedTracks/>
          <button onClick={() => extractAndRecommend(selected)}>Use these tracks!</button>
        </div>
      </Half> */}
    </Container>
  )
}

export default Search;
