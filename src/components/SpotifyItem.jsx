
import React from 'react';
import styled from '@emotion/styled';

import { colors, easeOutExpo } from '../theme';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 60px;
  width: 100%;
  padding: .5em;
  border-radius: .25em;
  color: inherit;
  transition: all .3s ${easeOutExpo};

  &:hover {
    background: ${props => props.hoverColor ? `${colors.green}40` : 'inherit'};
  }

  & + & {
    margin-top: .25em;
  }
`

const Artwork = styled.img`
  height: 60px;
  width: 60px;
  margin-right: .5em;
`

const SpotifyItem = ({ children, artwork, ...props }) => (
  <Container {...props}>
    <Artwork src={artwork}/>
    {children}
  </Container>
)

export default SpotifyItem;
