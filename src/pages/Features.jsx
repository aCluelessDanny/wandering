
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import round from 'lodash/round';

import FeatureBars from '../components/FeatureBars';
import { getUserTastes } from '../utils/scoring';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 600px;
`

const Bars = styled.div`
  flex: 1;
  width: 100%;
`

const Content = styled.div`
  flex: 1;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const CentroidButton = styled.button`

`

// TODO: Actually finish this
const Features = ({ id }) => {
  const [count, setCount] = useState(undefined);
  const [data, setData] = useState([]);
  const [centroid, setCentroid] = useState(0);

  useEffect(() => {
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
        setData(tastes);
        setCount(data.length);
      })
  }, []);

  let details;
  if (count === undefined) {
    details = (<p>Loading...</p>)
  } else if (count === 0) {
    details = (<p>No tracks?!</p>)
  } else {
    details = (
      <>
        <p>Out of the {count} track{count > 1 ? 's' : ''} analyzed, these are your results.</p>
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
      <h2>Your music tastes!</h2>
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
