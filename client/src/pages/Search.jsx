
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Search = ({ spot }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log(selected);
  }, [selected.length]);

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
    <div>
      <h1>Search!</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <SearchBar spot={spot} selected={selected} setSelected={setSelected}/>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Selected...</h2>
          <SelectedTracks/>
        </div>
      </div>
    </div>
  )
}

export default Search;
