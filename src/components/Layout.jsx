
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from '@emotion/styled';
import './index.css';

const Container = styled.div``

const Layout = ({ children }) => {
  return (
    <Container>
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>Wandering</title>
        <meta name="description" content="Find new music with the help of your tastes..."/>
        <meta name="author" content="a clueless danny"/>
        <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>
      </Helmet>
      {children}
    </Container>
  )
}

export default Layout;
