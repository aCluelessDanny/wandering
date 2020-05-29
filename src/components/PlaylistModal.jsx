
import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled';
import { X } from 'react-feather';

import SpotifyList from './SpotifyList';
import SpotifyItem from './SpotifyItem';
import defaultCover from '../images/default_cover.png';
import { colors } from '../theme';

const Modal = styled.div`
  position: absolute !important;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em .5em;
  border-radius: 1em;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  z-index: 10;
`

const Header = styled.h3`
  text-align: center;
  margin-bottom: .5em;
`

const XWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5em;
  cursor: pointer;
`

const PlaylistModal = ({ spotify, selected, setShowSelf }) => {
  const [playlists, setPlaylists] = useState([]);

  // Get user playlists on load
  useEffect(() => {
    spotify.getUserPlaylists()
      .then(({ items }) => setPlaylists(items));
  }, []);

  // Handler for adding songs to a user's playlsit
  const handleAddToPlaylist = (pID) => {
    spotify.postTrackInPlaylist(pID, selected.id)
      .then(_ => {
        alert("The track has been added to your playlist!");
        setShowSelf(false);
      })
      .catch(err => alert(`Something went wrong? ${err.message}`))
  }

  return (
    <Modal>
      <Header>Which playlist?</Header>
      <SpotifyList style={{ flex: 1 }} bg={`${colors.dark2}80`}>
        {playlists.map((p, i) => {
          const { id, name, images } = p;
          const imageURL = images.length > 0 ? images[0].url : defaultCover;

          return (
            <SpotifyItem key={i} artwork={imageURL} onClick={() => handleAddToPlaylist(id)} hoverColor pointer style={{ fontSize: ".8em "}}>
              <p>{name}</p>
            </SpotifyItem>
          )
        })}
      </SpotifyList>
      <XWrapper onClick={() => setShowSelf(false)}>
        <X size={36}/>
      </XWrapper>
    </Modal>
  )
}

export default PlaylistModal;
