
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

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

const Playlists = ({ spotify, extractAndRecommend }) => {
  const [playlists, setPlaylists] = useState([]);
  const [pickedList, setPickedList] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    spotify.getUserPlaylists({ limit: 50 })
      .then(({ items }) => setPlaylists(items));
  }, []);

  const selectPlaylist = ({ id, name }) => {
    spotify.getPlaylistTracks(id)
      .then(data => {
        data.items = data.items.map(i => i.track);
        setPickedList({ name, ...data });
        setSelected([]);
      });
  }

  const toggleTrack = (track) => {
    if (track.is_local || !track.id) {
      console.warn("This track is local or inaccesible! Can't use this one...");
      return;
    }

    const newSelected = [...selected];
    const index = newSelected.map(n => n.id).indexOf(track.id);

    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(track);
    }

    setSelected(newSelected);
  }

  const useSelectedTracks = () => {
    if (selected.length === 0) {
      console.error("No tracks selected!");
      return;
    }
    extractAndRecommend(selected);
  }

  // TODO: Pagination
  const PlaylistPicker = () => (
    <ul>
      {playlists.map((p, i) => (
        <li key={i} onClick={() => selectPlaylist(p)}>
          <p>{p.name} - {p.description}</p>
          <p>{p.tracks.total} track(s)</p>
        </li>
      ))}
    </ul>
  )

  // TODO: Pagination
  const TrackPicker = () => {
    if (!pickedList) { return null }

    return (
      <>
        <h3>{pickedList.name}</h3>
        <ul>
          {pickedList.items.map((t, i) => (
            <li key={i} onClick={() => toggleTrack(t)}>
              <p>{t.name} - {t.artists.map(a => a.name).join(", ")}</p>
            </li>
          ))}
        </ul>
        <button onClick={useSelectedTracks}>Use selected tracks!</button>
      </>
    )
  }

  return (
    <Container>
      <Half>
        <h1>Playlists!</h1>
        <div>
          <h2>Pick a playlist...</h2>
          <PlaylistPicker/>
        </div>
      </Half>
      <Half>
        <div>
          <h2>...then pick some tracks</h2>
          <TrackPicker/>
        </div>
      </Half>
    </Container>
  )
}

export default Playlists;
