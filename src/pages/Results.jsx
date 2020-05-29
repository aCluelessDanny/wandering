
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import _ReactLoading from 'react-loading';
import { CSSTransition } from 'react-transition-group';
import ReactTooltip from 'react-tooltip';
import isEmpty from 'lodash/isEmpty';
import { Play, Pause, VolumeX, PlusCircle, List, MessageSquare } from 'react-feather';

import SpotifyList from '../components/SpotifyList';
import SpotifyItem from '../components/SpotifyItem';
import FeatureBars from '../components/FeatureBars';
import PlaylistModal from '../components/PlaylistModal';
import NoteModal from '../components/NoteModal';
import Tooltip from '../components/Tooltip';
import { colors, easeOutExpo } from '../theme';
import './transitions.css';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 840px;
`

const ReactLoading = styled(_ReactLoading)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Header = styled.h2`
  margin-bottom: 1rem;
`

const Flex = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  overflow: scroll;
`

const ResultsList = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Preview = styled.div`
  position: relative;
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 1em;
`

const BigArtwork = styled.div`
  position: relative;
  flex: 1;
  background: transparent;
  background: url(${props => props.artwork}) no-repeat center center;
  background-size: contain;
  transition: all .5s ${easeOutExpo};
`

const TrackOptions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  background: #0004;
  opacity: 0;
  backdrop-filter: blur(6px);
  transition: all .5s ${easeOutExpo};

  &:hover {
    opacity: 1;
  }
`

const OptionIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5em;
  margin: .5em;
  cursor: pointer;
`

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

const Icon = styled.div`
  display: flex;
  align-items: center;
  padding: .25em;
  opacity: ${props => props.disabled ? 0.5 : 1};
`

const Results = ({ spotify, target: { tracks, tastes }, results }) => {
  // STATE AND REFS
  const [selected, setSelected] = useState({});
  const [playing, setPlaying] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const audioRef = useRef();

  // EFFECTS
  // Stop and load new audio when clicking on a preview
  useEffect(() => {
    if (!selected) { return }
    if (showPlaylistModal) { setShowPlaylistModal(false) }
    if (showNoteModal) { setShowNoteModal(false) }

    ReactTooltip.rebuild();
    audioRef.current.pause();
    audioRef.current.load();
    setPlaying(true);
  }, [selected]);

  // Play or pause audio accordingly
  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  // FUNCTIONS
  // Toggle preview playback
  const togglePlayback = (r, i) => {
    if (selected && selected.preview_url === r.preview_url) {
      setPlaying(!playing);
    } else {
      setPlaying(false);
      setSelected({ index: i, ...r });
    }
  }

  // Handler for adding songs to user's library
  const handleAddToLibrary = () => {
    spotify.putTrackInLibrary(selected.id)
      .then(_ => alert("The track has been added to your library!"))
      .catch(err => alert(`Something went wrong? ${err.message}`));
  }

  // COMPONENTS
  // TODO: Compare target tastes with currently playing track
  const hits = () => {
    if (!results) { return null }

    return (
      <SpotifyList>
        {results.map((r, i) => {
          const { name, artists, album: { images }, preview_url } = r;
          const { index } = selected;
          const artistStr = artists.map(a => a.name).join(", ");
          const imageURL = images[2].url;
          const current = i === index;

          let playIcon;
          if (preview_url === null) {
            playIcon = <Icon disabled data-tip data-for="noPreview"><VolumeX color={colors.light}/></Icon>
          } else if (current && playing) {
            playIcon = <Icon><Pause color={colors.light}/></Icon>
          } else {
            playIcon = <Icon><Play color={colors.light}/></Icon>
          }

          return (
            <SpotifyItem artwork={imageURL} key={i} selected={current} onClick={() => togglePlayback(r, i)} pointer hoverColor>
              <Details>
                <p>{name}</p>
                <span>{artistStr}</span>
              </Details>
              {playIcon}
            </SpotifyItem>
          )
        })}
      </SpotifyList>
    )
  }

  const selectedTrack = () => {
    let imageURL = null;
    let breakdown = [0, 0, 0, 0, 0, 0, 0];
    if (!isEmpty(selected)) {
      imageURL = selected.album.images[0].url;
      breakdown = selected.breakdown;
    }

    return (
      <Preview>
        <CSSTransition in={showPlaylistModal} unmountOnExit timeout={500} classNames="playlistsModal">
          <PlaylistModal spotify={spotify} selected={selected} setShowSelf={setShowPlaylistModal}/>
        </CSSTransition>
        <CSSTransition in={showNoteModal} unmountOnExit timeout={500} classNames="noteModal">
          <NoteModal spotify={spotify} selected={selected} setShowSelf={setShowNoteModal}/>
        </CSSTransition>
        <BigArtwork artwork={imageURL}>
          {!isEmpty(selected) && (
            <TrackOptions>
              <OptionIcon data-tip data-for="addToLibrary" onClick={handleAddToLibrary}>
                <PlusCircle size={36}/>
              </OptionIcon>
              <OptionIcon data-tip data-for="addToPlaylist" onClick={() => setShowPlaylistModal(true)}>
                <List size={36}/>
              </OptionIcon>
              <OptionIcon data-tip data-for="personalNote" onClick={() => setShowNoteModal(true)}>
                <MessageSquare size={36}/>
              </OptionIcon>
            </TrackOptions>
          )}
        </BigArtwork>
        <FeatureBars flex={1} data={breakdown} small/>
      </Preview>
    )
  }

  return (
    <Container>
      {results.length === 0 && <ReactLoading type="bubbles"/>}
      <Header>I think you might like these...</Header>
      <Flex>
        <ResultsList>
          {hits()}
        </ResultsList>
        {selectedTrack()}
      </Flex>
      <audio ref={audioRef} src={selected.preview_url} onEnded={() => setPlaying(false)}/>
      <Tooltip id="noPreview" place="top">
        <p>This track doesn't have a preview! You can still visit it in Spotify if you're curious.</p>
      </Tooltip>
      <Tooltip id="addToLibrary" place="top">
        <p>Add this track to your library!</p>
      </Tooltip>
      <Tooltip id="addToPlaylist" place="top">
        <p>Add this track to one of your playlists</p>
      </Tooltip>
      <Tooltip id="personalNote" place="top">
        <p>Leave a personal note on this track~</p>
      </Tooltip>
    </Container>
  )
}

export default Results;
