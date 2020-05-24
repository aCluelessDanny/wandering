
import React from 'react';
import styled from '@emotion/styled';
import { ArrowLeft } from 'react-feather';

const Icon = styled.div`
  position: relative;
  cursor: pointer;
`

const BackButton = ({ action }) => (
  <Icon onClick={action}>
    <ArrowLeft size={36}/>
  </Icon>
)

export default BackButton;
