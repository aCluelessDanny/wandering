
import React from 'react';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

import { colors } from '../theme';

const Container = styled.div`
  max-width: 200px;
  text-align: center;
`

const Tooltip = ({ id, place, children, ...props }) => (
  <ReactTooltip
    id={id}
    place={place ? place : "right"}
    effect="solid"
    delayShow={250}
    backgroundColor={colors.dark}
    {...props}
  >
    <Container>
      {children}
    </Container>
  </ReactTooltip>
)

export default Tooltip;
