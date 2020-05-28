
import React from 'react'
import styled from '@emotion/styled';

import { colors } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: .5em;
  border-radius: .25em;
  overflow: scroll;
  background: ${colors.dark};
  color: ${colors.white};
`

const SpotifyList = ({ children }) => (
  <Container>
    {children}
  </Container>
)

export default SpotifyList;
