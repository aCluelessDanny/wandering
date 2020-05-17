
import SearchBar from '../components/SearchBar';

import recommendTracks from '../utils/recommendTracks';
import extractTracks from '../utils/extractTracks';

import React, { useState } from 'react';

const Search = ({ setTarget, setPage, setResults, spot, userID }) => {
  const [selected, setSelected] = useState([]);

  const removeTrack = (index) => {
    let tracks = [...selected];
    tracks.splice(index, 1);
    setSelected(tracks);
  }

  const useSelectedTracks = () => {
    return new Promise((resolve, reject) => extractTracks({ resolve, reject }, spot, userID, selected))
    .then(data => {
      setTarget(data);
      setPage(3);
      return data;
    })
    .then(data => new Promise((resolve, reject) => recommendTracks({ resolve, reject }, spot, data)))
    .then(data => setResults(data))
    .catch(err => console.error(err))
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
    <div>
      <h1>Search!</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <SearchBar spot={spot} selected={selected} setSelected={setSelected}/>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Selected...</h2>
          <SelectedTracks/>
          <button onClick={useSelectedTracks}>Use these tracks!</button>
        </div>
      </div>
    </div>
  )
}

export default Search;
