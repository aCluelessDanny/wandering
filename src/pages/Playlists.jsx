
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import isEmpty from 'lodash/isEmpty';

import Button from '../components/Button';
import { colors } from '../theme';
import defaultCover from '../images/default_cover.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 840px;
`

const Duo = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  margin: 1.5em 0;
  overflow: hidden;
`

const Half = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0 1em;
  overflow: hidden;
`

const PickerHeader = styled.h2`
  margin-bottom: 1rem;
`

const PlaylistName = PickerHeader.withComponent('h3');

const Picker = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
`

const Playlist = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px .5em;
  border-radius: 4px;
  cursor: pointer;
  background: ${colors.dark2};
  color: ${colors.white};

  &.selected {
    background: ${colors.dark3};
  }

  & + & {
    margin-top: 4px;
  }
`

const Track = Playlist;

const Artwork = styled.img`
  height: 50px;
  width: 50px;
  margin: 0 4px;
`

// TODO: Hide right section when no playlist is selected (maybe animated?)
const Playlists = ({ spotify, extractAndRecommend }) => {
  // STATE AND REFS
  const [playlists, setPlaylists] = useState([]);
  const [pickedList, setPickedList] = useState(null);
  const [selected, setSelected] = useState([]);

  // EFFECTS
  // Get playlists on load
  useEffect(() => {
    spotify.getUserPlaylists({ limit: 50 })
      .then(({ items }) => setPlaylists(items));
  }, []);

  // FUNCTIONS
  // Select playlist from list
  const selectPlaylist = ({ id, name }, index) => {
    spotify.getPlaylistTracks(id)
      .then(data => {
        data.items = data.items.map(i => i.track);
        setPickedList({ index, name, ...data });
        setSelected([]);
      });
  }

  // Push/Remove track to/from selected list
  const toggleTrack = (track) => {
    // TODO: Warn the user about not being able to select certain tracks
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

  // Send tracks for extraction and recommendation
  const useSelectedTracks = () => {
    if (selected.length === 0) {
      console.error("No tracks selected!");
      return;
    }
    extractAndRecommend(selected);
  }

  // COMPONENTS
  // TODO: Pagination
  const playlistPicker = () => (
    <Picker>
      {playlists.map((p, i) => {
        const { name, images } = p;
        const imageURL = images.length > 0 ? images[0].url : defaultCover;
        const picked = (pickedList && i === pickedList.index) ? "selected" : "";

        return (
          <Playlist key={i} className={picked} onClick={() => selectPlaylist(p, i)}>
            <Artwork src={imageURL} alt={`Album cover for ${name}`}/>
            <p>{name}</p>
          </Playlist>
        )
      })}
    </Picker>
  )

  // TODO: Pagination
  const trackPicker = () => {
    if (!pickedList) { return null }
    const ids = selected.map(t => t.id);

    return (
      <>
        <PlaylistName>{pickedList.name}</PlaylistName>
        <Picker>
          {pickedList.items.map((t, i) => {
            const { id, name, album: { images }} = t;
            const imageURL = images.length > 0 ? images[0].url : defaultCover;
            const picked = ids.indexOf(id) > -1 ? "selected" : "";

            return (
              <Track key={i} className={picked} onClick={() => toggleTrack(t)}>
                <Artwork src={imageURL} alt={`Album cover for ${name}`}/>
                <p>{name}</p>
              </Track>
            )
          })}
        </Picker>
      </>
    )
  }

  return (
    <Container>
      <Duo>
        <Half>
          <PickerHeader>Pick a playlist...</PickerHeader>
          {/* <PlaylistPicker/> */}
          {playlistPicker()}
        </Half>
        <Half>
          <PickerHeader>...then pick some tracks</PickerHeader>
          {/* <TrackPicker/> */}
          {trackPicker()}
          <Button disabled={isEmpty(selected)} action={useSelectedTracks}>Use these tracks</Button>
        </Half>
      </Duo>
    </Container>
  )
}

export default Playlists;
