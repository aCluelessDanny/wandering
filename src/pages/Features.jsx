
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import _ReactLoading from 'react-loading';

import FeatureBars from '../components/FeatureBars';
import { colors } from '../theme';
import { getUserTastes } from '../utils/scoring';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 600px;
`

const ReactLoading = styled(_ReactLoading)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`

const Header = styled.h2`
  margin-bottom: .5em;
  text-align: center;
`

const Bars = styled.div`
  flex: 2;
  width: 100%;
`

const Content = styled.div`
  flex: 1;
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5em;
`

const CentroidButton = styled.button`
  position: relative;
  height: 50px;
  width: 50%;
  padding: .4em 1em;
  border-radius: 1em;
  background: ${props => props.dark ? colors.dark2 : colors.dark3};
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
    border-radius: 1em;
    background: ${colors.dark};
    opacity: 0.5;
  }
`

const Features = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(undefined);
  const [data, setData] = useState([]);
  const [centroid, setCentroid] = useState(0);

  // Load tastes upon loading
  useEffect(() => {
    setLoading(true);
    axios.get('/api/getUser', { params: { id }})
      .then(({ data }) => {
        const { _id } = data;
        return axios.get('/api/getTastes', { params: { id: _id }});
      })
      .then(({ data }) => {
        const tracks = data.map(d => {
          const { $init, popularity, ...rest } = d;
          return { metadata: { popularity }, features: { ...rest }}
        });
        const tastes = getUserTastes(tracks);
        setLoading(false);
        setData(tastes);
        setCount(data.length);
      })
  }, []);

  let details;
  if (loading) {
    details = (<p>Loading...</p>)
  } else {
    details = (
      <>
        {(count === 0) ? (
          <p>Looks like you haven't tried analyzing any tracks. Give it a try!</p>
        ) : (
          <p>Out of the {count} track{count > 1 ? 's' : ''} analyzed, these are your results.</p>
        )}
        <p>Wandering groups your tastes into 3 groups. They may look similar or they may be wildly different, it's all based on your preferences!</p>
        <ButtonContainer>
          <CentroidButton onClick={() => setCentroid(0)} disabled={centroid === 0}>1</CentroidButton>
          <CentroidButton onClick={() => setCentroid(1)} disabled={centroid === 1}>2</CentroidButton>
          <CentroidButton onClick={() => setCentroid(2)} disabled={centroid === 2}>3</CentroidButton>
        </ButtonContainer>
      </>
    )
  }

  return (
    <Container>
      {loading && <ReactLoading type="bubbles"/>}
      <Header>Your music tastes!</Header>
      <Bars>
        <FeatureBars data={data.length > 0 ? data[centroid] : [0,0,0,0,0,0,0]}/>
      </Bars>
      <Content>
        {details}
      </Content>
    </Container>
  )
}

export default Features;
