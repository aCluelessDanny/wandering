
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

  &:disabled::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 2em;
    background: ${colors.dark};
    opacity: 0.5;
  }
`

const Button = ({ children, click, ...props }) => (
  <Container onClick={click} {...props}>
    {children}
  </Container>
);

export default Button;
