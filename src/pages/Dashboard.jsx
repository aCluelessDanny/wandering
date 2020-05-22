
import React from 'react'
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Dashboard = ({ setPage, useTopTracks }) => (
  <Container>
    <h1>Search for your songs...</h1>
    <button onClick={() => setPage(1)}>Search</button>
    <button onClick={() => setPage(2)}>Pick a playlist</button>
    <button onClick={useTopTracks}>Use your Top Tracks</button>
    <button>Use your library</button>
    <button onClick={() => setPage(4)}>Your Music Features</button>
  </Container>
)

export default Dashboard;
