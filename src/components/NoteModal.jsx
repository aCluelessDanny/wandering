
import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled';
import axios from 'axios';
import { X, Send } from 'react-feather';

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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  z-index: 10;
`

const Header = styled.h3`
  text-align: center;
  margin-bottom: .5em;
`

const Note = styled.textarea`
  width: 100%;
  height: 6em;
  padding: .5em;
  border: 1px solid darkslategrey;
  border-radius: 8px;
  margin: .5em;
  background: rgba(0, 0, 0, 0.5);
  color: inherit;
  font-size: inherit;
  font-family: inherit;
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5em;
  cursor: pointer;
`

const Button = styled.div`
  padding: .25em;
  margin: .25em;
  cursor: pointer;
`

const NoteModal = ({ spotify, selected, setShowSelf }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const noteRef = useRef();

  // Get comment from specified track on load
  useEffect(() => {
    setLoading(true);
    axios.get('/api/getComment', { params: { userID: spotify.getID(), trackID: selected.id }})
      .then(({ data }) => {
        const { comment } = data;
        setNote(comment ? comment : "");
        setLoading(false);
      })
      .catch(err => alert(`Couldn't load your comment? ${err.message}`))
  }, []);

  // Handler for adding comments to songs
  const handleAddComment = () => {
    axios.post('/api/postComment', { userID: spotify.getID(), trackID: selected.id, comment: noteRef.current.value.trim() })
      .then(_ => setShowSelf(false))
      .catch(err => alert(`Couldn't save your comment? ${err.message}`));
  }

  return (
    <Modal>
      <Header>Leave a nice note~</Header>
      <Note
        ref={noteRef}
        placeholder="Say something nice about this song..."
        defaultValue={loading ? "Checking if you left a comment real quick..." : note}
        readOnly={loading}
      />
      <ButtonsWrapper>
        <Button onClick={() => setShowSelf(false)}>
          <X size={36}/>
        </Button>
        <Button onClick={() => handleAddComment()}>
          <Send size={36}/>
        </Button>
      </ButtonsWrapper>
    </Modal>
  )
}

export default NoteModal;
