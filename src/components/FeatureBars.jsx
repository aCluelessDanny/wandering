
import React from 'react'
import styled from '@emotion/styled';
import round from 'lodash/round';

import { colors, easeOutExpo } from '../theme';
import Tooltip from './Tooltip';

const Container = styled.div`
  flex: ${props => props.flex ? props.flex : 'initial'};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
  padding: 1em 0 0;

  @media screen and (max-width: 820px) {
    flex: initial;
    height: ${props => props.small ? '600px' : '500px'};
    padding: 1em;
  }
`

const BarContainer = styled.div`
  position: relative;
  height: ${props => props.small ? '6px' : '12px'};
  width: 100%;
  font-size: ${props => props.small ? '.8em' : '.9em'};

  & + & {
    margin-top: ${props => props.small ? '12px' : '30px'};
  }
`

const Bar = styled.div`
  height: 100%;
  width: 100%;
  border-radius: .25em;
  background: ${props => props.bg ? props.bg : colors.dark2};
  overflow: hidden;
`

const FeatureName = styled.span`
  position: absolute;
  left: .3em;
  bottom: 100%;
`

const Fill = styled.div`
  height: 100%;
  width: ${props => props.percent ? `${props.percent}%` : '0%'};
  background: ${props => props.color ? props.color : colors.green};
  transition: all 0.5s ${easeOutExpo};
`

const TargetDot = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.percent ? `${props.percent}%` : '0%'};
  transform: translate(-50%, -50%);
  height: 10px;
  width: 10px;
  border: 2px solid ${props => props.border ? props.border : colors.dark3};
  border-radius: 50%;
  background: ${props => props.bg ? props.bg : colors.dark2};
  transition: all .5s ${easeOutExpo};
`

const featureDescriptions = [
  {
    name: 'Popularity',
    description: 'A measure of how popular and relevant a song you listen to is in Spotify\'s platform. Simple.',
    color1: '#FABF1C',
    color2: '#4C3C0E'
  },
  {
    name: 'Energy',
    description: 'How "energetic" a song feels. A high value here means you like more intense or "active" songs, while lower values is more mellow and soothing.',
    color1: '#D05353',
    color2: '#290A0A'
  },
  {
    name: 'Tempo',
    description: 'The overall BPM. Faster it goes, the bigger the BPM.',
    color1: '#39A284',
    color2: '#112E35'
  },
  {
    name: 'Valence',
    description: 'Musical positivity! Higher values mean happy or upbeat tunes, while lower ones mean the opposite.',
    color1: '#FFA630',
    color2: '#474747'
  },
  {
    name: 'Danceability',
    description: 'Yes, this is a word. This means how suitable the songs are for dancing. Higher means it\'s catchy but also rhythmically steady.',
    color1: '#28AFB0',
    color2: '#1B2727'
  },
  {
    name: 'Acousticness',
    description: 'This measure says how much you lean on "acoustic" songs, or digital if the value is low.',
    color1: '#A77E73',
    color2: '#332E3C'
  },
  {
    name: 'Instrumentalness',
    description: 'The affinity towards instrumentals. Higher means you like songs without vocals, and lower means otherwise.',
    color1: '#85A6D0',
    color2: '#26545A'
  },
]

const FeatureBars = ({ data, target, small, ...props }) => {
  const feature = (value, index) => {
    const { name, description, color1, color2 } = featureDescriptions[index];

    return (
      <BarContainer key={index} small={small} data-tip data-for={name}>
        <FeatureName>{name}</FeatureName>
        <Bar bg={color2}>
          <Fill color={color1} percent={value * 100}/>
        </Bar>
        {target && (
          <TargetDot border={color1} bg={color2} percent={target[index] * 100}/>
        )}
        <Tooltip id={name}>
          <h4>{name}</h4>
          <p>{description}</p>
          {target ? (
            <p>The target score for your tastes is around <b>{round(target[index], 2)}</b></p>
          ) : (
            <p>Your score here is <b>{round(value, 2)}</b></p>
          )}
        </Tooltip>
      </BarContainer>
    )
  }

  return (
    <Container {...props}>
      {data.map((value, i) => feature(value, i))}
    </Container>
  )
}

export default FeatureBars;
