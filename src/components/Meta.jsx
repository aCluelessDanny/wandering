
import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ children }) => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>Wandering</title>
        <meta name="description" content="Find new music with the help of your tastes..."/>
        <meta name="author" content="a clueless danny"/>
        <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>
      </Helmet>
      {children}
    </>
  )
}

export default Meta;
