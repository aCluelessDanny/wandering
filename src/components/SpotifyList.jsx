
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
  background: ${props => props.bg ? props.bg : colors.dark};
  color: ${colors.white};

  &:empty {
    padding: 0;
  }
`

const SpotifyList = ({ children, ...props }) => (
  <Container {...props}>
    {children}
  </Container>
)

export default SpotifyList;
