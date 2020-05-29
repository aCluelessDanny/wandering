
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ArrowLeft, ArrowRight } from 'react-feather';
import isEmpty from 'lodash/isEmpty';

import Button from '../components/Button';
import SpotifyList from '../components/SpotifyList';
import SpotifyItem from '../components/SpotifyItem';
import Tooltip from '../components/Tooltip';
import { colors, easeOutExpo } from '../theme';
import defaultCover from '../images/default_cover.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 820px;

  @media screen and (max-width: 820px) {
    max-width: 600px;
  }
`

const Duo = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  overflow: hidden;

  @media screen and (max-width: 820px) {
    flex-direction: column;
    overflow: initial;
  }
`

const Half = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0 1em;
  overflow: hidden;

  @media screen and (max-width: 820px) {
    height: 580px;
    padding: 1em;
    overflow: initial;
  }
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

const PageButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const PageButton = styled.button`
  padding: .5em;
  border: none;
  background: transparent;
  color: ${colors.white};
  transition: all .5s ${easeOutExpo};

  &:disabled {
    opacity: .4;
    cursor: initial;
  }

  &:not(:disabled):hover {
    transform: scale(1.05);
  }
`

const playlistChunk = 25;
const tracksChunk = 100;

const Playlists = ({ spotify, extractAndRecommend }) => {
  // STATE AND REFS
  const [playlists, setPlaylists] = useState([]);
  const [playlistOffset, setPlaylistOffset] = useState(0);
  const [pickedList, setPickedList] = useState({});
  const [pickedListOffset, setPickedListOffset] = useState(0);
  const [tracks, setTracks] = useState({});
  const [selected, setSelected] = useState([]);

  // EFFECTS
  // Get playlists on load and when changing pages
  useEffect(() => {
    spotify.getUserPlaylists(playlistOffset, playlistChunk)
      .then(data => {
        setPlaylists(data);
        setPickedList({});
        setTracks({});
      });
  }, [playlistOffset]);

  // Get tracks from a specified playlist
  useEffect(() => {
    if (isEmpty(pickedList)) { return }

    spotify.getPlaylistTracks(pickedList.id, 0)
      .then(data => {
        setTracks(data);
        setPickedListOffset(0);
        setSelected([]);
      });
  }, [pickedList]);

  // Get new tracks when navigating pages of a playlist
  useEffect(() => {
    if (isEmpty(pickedList)) { return }

    spotify.getPlaylistTracks(pickedList.id, pickedListOffset)
      .then(data => {
        setTracks(data);
      });
  }, [pickedListOffset]);

  // FUNCTIONS
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
      alert("No tracks were selected!");
      return;
    }
    extractAndRecommend(selected);
  }

  // COMPONENTS
  const playlistPicker = () => {
    if (isEmpty(playlists)) { return null }

    return (
      <SpotifyList>
        {playlists.items.map((p, i) => {
          const { name, images } = p;
          const { id } = pickedList
          const imageURL = images.length > 0 ? images[0].url : defaultCover;

          return (
            <SpotifyItem key={i} onClick={() => setPickedList(p)} selected={p.id === id} artwork={imageURL} alt={`Artwork for playlist ${name}`} hoverColor pointer>
              <p>{name}</p>
            </SpotifyItem>
          )
        })}
      </SpotifyList>
    )
  }

  const trackPicker = () => {
    if (isEmpty(pickedList) || isEmpty(tracks)) { return null }
    const ids = selected.map(t => t.id);


    return (
      <>
        <PlaylistName>{pickedList.name}</PlaylistName>
        <SpotifyList bg={colors.dark2} style={{ zIndex: 1 }}>
          {tracks.items.map((t, i) => {
            if (t === undefined) { return null }

            const { id, is_local, name, album: { images }} = t.track;
            const imageURL = images.length > 0 ? images[0].url : defaultCover;

            if (is_local || !id) return (
              <SpotifyItem disabled key={i} artwork={imageURL} alt={`Album artwork for ${name}`} data-tip data-for="unavailableTrack">
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
              <SpotifyItem key={i} onClick={() => toggleTrack(t)} selected={selected} artwork={imageURL} alt={`Album artwork for ${name}`} hoverColor pointer>
                <Details>
                  <p>{name}</p>
                </Details>
              </SpotifyItem>
            )
          })}
        </SpotifyList>
        <PageButtonWrapper>
          <PageButton
            disabled={!tracks.previous}
            onClick={() => setPickedListOffset(tracks.offset - tracksChunk)}
          >
            <ArrowLeft size={36}/>
          </PageButton>
          <PageButton
            disabled={!tracks.next}
            onClick={() => setPickedListOffset(tracks.offset + tracksChunk)}
          >
            <ArrowRight size={36}/>
          </PageButton>
        </PageButtonWrapper>
        <Button disabled={isEmpty(selected)} action={useSelectedTracks}>Use these tracks</Button>
      </>
    )
  }

  return (
    <Container>
      <Duo>
        <Half>
          <PickerHeader>Pick a playlist...</PickerHeader>
          {playlistPicker()}
          <PageButtonWrapper>
            <PageButton
              disabled={isEmpty(playlists) || !playlists.previous}
              onClick={() => setPlaylistOffset(playlists.offset - playlistChunk)}
            >
              <ArrowLeft size={36}/>
            </PageButton>
            <PageButton
              disabled={isEmpty(playlists) || !playlists.next}
              onClick={() => setPlaylistOffset(playlists.offset + playlistChunk)}
            >
              <ArrowRight size={36}/>
            </PageButton>
          </PageButtonWrapper>
        </Half>
        <Half>
          <PickerHeader>...then pick some tracks</PickerHeader>
          {trackPicker()}
        </Half>
      </Duo>
    </Container>
  )
}

export default Playlists;
