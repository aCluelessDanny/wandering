
import React from 'react'
import styled from '@emotion/styled';
import { colors } from '../theme';

const Container = styled.button`
  position: relative;
  height: 50px;
  width: 260px;
  padding: .4em 1em;
  border-radius: 2em;
  background: ${colors.dark3};
  color: ${colors.white};
  font-size: inherit;
  font-family: inherit;
  border: none;
`

const Button = ({ children, click }) => (
  <Container onClick={click}>
    {children}
  </Container>
);

export default Button;
