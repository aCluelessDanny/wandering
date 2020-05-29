
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import _ReactLoading from 'react-loading';
import isEmpty from 'lodash/isEmpty';
import { CSSTransition } from 'react-transition-group';
import { Play, Pause } from 'react-feather';

import SpotifyList from '../components/SpotifyList';
import SpotifyItem from '../components/SpotifyItem';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import FeatureBars from '../components/FeatureBars';
import { colors, easeOutExpo } from '../theme';
import defaultCover from '../images/default_cover.png';

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
  width: 100%;
`

const Preview = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 1em;
`

const BigArtwork = styled.div`
  flex: 1;
  background: transparent;
  background: url(${props => props.artwork}) no-repeat center center;
  background-size: contain;
  transition: all .5s ${easeOutExpo};
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
`

// const Prompt = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
// `

// const Modal = styled.div`
//   position: absolute !important;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
//   background: rgba(0, 0, 0, 0.5);
//   border-radius: 1em;
//   backdrop-filter: blur(3px);
// `

// const ModalContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: ${props => props.center ? "center" : "normal"};
//   height: 100%;
//   width: 100%;
//   padding: 1.5em;
// `

// const ModalList = styled.div`
//   flex: 1;
//   width: 100%;
//   margin: 1em 0;
//   overflow: scroll;
// `;

// const ModalItem = styled.div`
// display: flex;
// align-items: center;
// width: 100%;
// padding: 4px .5em;
// border-radius: 4px;
// cursor: pointer;
// background: ${colors.white};
// color: ${colors.dark};

// &.selected {
//   background: ${colors.light};
// }

// & + & {
//   margin-top: 4px;
// }
// `;

// const Note = styled.textarea`
//   width: 100%;
//   height: 6em;
//   padding: .5em;
//   border: 1px solid darkslategrey;
//   border-radius: 8px;
//   margin: .5em;
//   background: rgba(0, 0, 0, 0.5);
//   color: inherit;
//   font-size: inherit;
//   font-family: inherit;
// `

const Results = ({ spotify, target: { tracks, tastes }, results }) => {
  // STATE AND REFS
  const [selected, setSelected] = useState({});
  const [playing, setPlaying] = useState(false);
  // const [playlists, setPlaylists] = useState([]);
  // const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  // const [showNoteModal, setShowNoteModal] = useState(false);
  // const [loadingNote, setLoadingNote] = useState(false);
  // const [note, setNote] = useState("");
  const audioRef = useRef();
  // const noteRef = useRef();

  // EFFECTS
  // Stop and load new audio when clicking on a preview
  useEffect(() => {
    if (!selected) { return }
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

  // // Get user playlists when needed
  // useEffect(() => {
  //   if (!showPlaylistModal) { return }

  //   spotify.getUserPlaylists()
  //     .then(({ items }) => setPlaylists(items));
  // }, [showPlaylistModal]);

  // // Get comment from specified track
  // useEffect(() => {
  //   if (!showNoteModal) { return }

  //   setLoadingNote(true);
  //   axios.get('/api/getComment', { params: { userID: spotify.getID(), trackID: selected.id }})
  //     .then(({ data }) => {
  //       const { comment } = data;
  //       setNote(comment ? comment : "");
  //       setLoadingNote(false);
  //     })
  //     .catch(err => console.error(err))
  // }, [showNoteModal])

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

  // // Handler for adding songs to user's library
  // const handleAddToLibrary = () => {
  //   spotify.putTrackInLibrary(selected.id);
  // }

  // // Handler for adding songs to a user's playlsit
  // const handleAddToPlaylist = (pID) => {
  //   spotify.postTrackInPlaylist(pID, selected.id)
  //     .then(_ => setShowPlaylistModal(false))
  // }

  // // Handler for adding comments to songs
  // const handleAddComment = (comment) => {
  //   axios.post('/api/postComment', { userID: spotify.getID(), trackID: selected.id, comment })
  //     .then(_ => setShowNoteModal(false))
  //     .catch(err => console.error(err))
  // }

  // COMPONENTS
  // TODO: Handle null preview links
  // TODO: Add success/failure messages upon clicking buttons
  // TODO: Allow user to make a new playlist if desired
  // const playlistModal = () => (
  //   <Modal>
  //     <ModalContainer>
  //       <h3>Which playlist?</h3>
  //       <ModalList>

  //         {playlists.map((p, i) => {
  //           const { id, name, images } = p;
  //           const imageURL = images.length > 0 ? images[0].url : defaultCover;

  //           return (
  //             <ModalItem key={i} onClick={() => handleAddToPlaylist(id)}>
  //               <Artwork src={imageURL} alt={`Album cover for ${name}`}/>
  //               <p>{name}</p>
  //             </ModalItem>
  //           )
  //         })}
  //       </ModalList>
  //       <BackButton action={() => setShowPlaylistModal(false)}/>
  //     </ModalContainer>
  //   </Modal>
  // )

  // const noteModal = () => (
  //   <Modal>
  //     <ModalContainer center>
  //       <h3>A note about this song...</h3>
  //       <Note
  //         ref={noteRef}
  //         placeholder="Say something nice about this song..."
  //         defaultValue={loadingNote ? "Loading..." : note}
  //         readOnly={loadingNote}
  //       />
  //       <Button action={() => handleAddComment(noteRef.current.value)}>Save note</Button>
  //       <Button action={() => setShowNoteModal(false)}>Cancel</Button>
  //     </ModalContainer>
  //   </Modal>
  // )

  const hits = () => {
    if (!results) { return null }

    return (
      <SpotifyList>
        {results.map((r, i) => {
          const { name, artists, album: { images } } = r;
          const { index } = selected;
          const artistStr = artists.map(a => a.name).join(", ");
          const imageURL = images[2].url;
          const current = i === index;

          return (
            <SpotifyItem artwork={imageURL} key={i} selected={current} onClick={() => togglePlayback(r, i)} pointer hoverColor>
              <Details>
                <p>{name}</p>
                <span>{artistStr}</span>
              </Details>
              <Icon>
                {current && playing ? (
                  <Pause color={colors.light}/>
                ) : (
                  <Play color={colors.light}/>
                )}
              </Icon>
            </SpotifyItem>
          )
        })}
      </SpotifyList>
    )
  }

  const selectedTrack = () => {
    let imageURL = null;
    let breakdown = [0, 0, 0, 0, 0, 0, 0];
    console.log(selected);
    if (!isEmpty(selected)) {
      imageURL = selected.album.images[0].url;
      breakdown = selected.breakdown;
    }

    return (
      <Preview>
        <BigArtwork artwork={imageURL}/>
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
      {/* <Duo>
        <Half>
          <Header>I think you might like these...</Header>
          <ResultList>
            <DisplayResults/>
          </ResultList>
        </Half>
        <Half>
          {picked()}
          <CSSTransition in={showPlaylistModal} unmountOnExit timeout={500} classNames="playlistsModal">
            {playlistModal()}
          </CSSTransition>
          <CSSTransition in={showNoteModal} unmountOnExit timeout={500} classNames="noteModal">
            {noteModal()}
          </CSSTransition>
        </Half>
      </Duo> */}
      <audio ref={audioRef} src={selected.preview_url} onEnded={() => setPlaying(false)}/>
    </Container>
  )
}

export default Results;
