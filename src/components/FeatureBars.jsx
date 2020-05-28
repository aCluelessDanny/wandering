
import React from 'react'
import styled from '@emotion/styled';

import { colors, easeOutExpo } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const BarContainer = styled.div`
  position: relative;
  height: .5em;
  width: 100%;
  margin: 1em 0;
`

const Bar = styled.div`
  height: 100%;
  width: 100%;
  border-radius: .25em;
  background: ${colors.dark2};
  overflow: hidden;
`

const FeatureName = styled.span`
  position: absolute;
  left: .3em;
  bottom: 100%;
  font-size: .9em;
`

const Fill = styled.div`
  height: 100%;
  width: ${props => props.percent ? `${props.percent}%` : '0%'};
  background: ${colors.green};
  transition: all 0.5s ${easeOutExpo};
`

const featureDescriptions = [
  {
    name: 'Popularity',
    description: 'A measure of how popular and relevant a song you listen to is in Spotify\'s platform. Simple.'
  },
  {
    name: 'Energy',
    description: 'How "energetic" a song feels. A high value here means you like more intense or "active" songs, while lower values is more mellow and soothing.'
  },
  {
    name: 'Tempo',
    description: 'The overall BPM. Faster it goes, the bigger the BPM.'
  },
  {
    name: 'Valence',
    description: 'Musical positivity! Higher values mean happy or upbeat tunes, while lower ones mean the opposite.'
  },
  {
    name: 'Danceability',
    description: 'Yes, this is a word. This means how suitable the songs are for dancing. Higher means it\'s catchy but also rhythmically steady.'
  },
  {
    name: 'Acousticness',
    description: 'This measure says how much you lean on "acoustic" songs, or digital if the value is low.'
  },
  {
    name: 'Instrumentalness',
    description: 'The affinity towards instrumentals. Higher means you like songs without vocals, and lower means otherwise.'
  },
]

const FeatureBars = ({ data }) => {
  const feature = (value, index) => {
    const { name, description } = featureDescriptions[index];

    return (
      <BarContainer>
        <FeatureName>{name}</FeatureName>
        <Bar key={index}>
          <Fill percent={value * 100}/>
        </Bar>
      </BarContainer>
    )
  }

  return (
    <Container>
      {data.map((value, i) => feature(value, i))}
    </Container>
  )
}

export default FeatureBars;
