
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import isEmpty from 'lodash/isEmpty';

import Button from '../components/Button';
import SpotifyList from '../components/SpotifyList';
import SpotifyItem from '../components/SpotifyItem';
import Tooltip from '../components/Tooltip';
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
  text-align: center;
`

const PlaylistName = PickerHeader.withComponent('h3');

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: .7em;
    color: ${colors.light};
  }
`

// TODO: Hide right section when no playlist is selected (maybe animated?)
const Playlists = ({ spotify, extractAndRecommend }) => {
  // STATE AND REFS
  const [playlists, setPlaylists] = useState([]);
  const [pickedList, setPickedList] = useState({});
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
    <SpotifyList>
      {playlists.map((p, i) => {
        const { name, images } = p;
        const { index } = pickedList;
        const imageURL = images.length > 0 ? images[0].url : defaultCover;

        return (
          <SpotifyItem key={i} artwork={imageURL} hoverColor onClick={() => selectPlaylist(p, i)} selected={i === index} pointer>
            <p>{name}</p>
          </SpotifyItem>
        )
      })}
    </SpotifyList>
  )

  // TODO: Pagination
  const trackPicker = () => {
    if (isEmpty(pickedList)) { return null }
    const ids = selected.map(t => t.id);

    return (
      <>
        <PlaylistName>{pickedList.name}</PlaylistName>
        <SpotifyList bg={colors.dark2} style={{ zIndex: 1 }}>
          {pickedList.items.map((t, i) => {
            const { id, is_local, name, album: { images }} = t;
            const imageURL = images.length > 0 ? images[0].url : defaultCover;

            if (is_local || !id) return (
              <SpotifyItem key={i} artwork={imageURL} disabled data-tip data-for="unavailableTrack">
                <Details>
                  <p>{name}</p>
                </Details>
                <Tooltip id="unavailableTrack" place="bottom">
                  <p>Wandering can't access this track because it's a local track or unavailable. Sorry!</p>
                </Tooltip>
              </SpotifyItem>
            )

            const selected = ids.indexOf(id) > -1;

            return (
              <SpotifyItem key={i} artwork={imageURL} hoverColor onClick={() => toggleTrack(t)} selected={selected} pointer>
                <Details>
                  <p>{name}</p>
                </Details>
              </SpotifyItem>
            )
          })}
        </SpotifyList>
      </>
    )
  }

  return (
    <Container>
      <Duo>
        <Half>
          <PickerHeader>Pick a playlist...</PickerHeader>
          {playlistPicker()}
        </Half>
        <Half>
          <PickerHeader>...then pick some tracks</PickerHeader>
          {trackPicker()}
          <Button disabled={isEmpty(selected)} action={useSelectedTracks}>Use these tracks</Button>
        </Half>
      </Duo>
    </Container>
  )
}

export default Playlists;
