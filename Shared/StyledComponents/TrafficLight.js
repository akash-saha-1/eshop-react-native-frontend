import styled, { css } from 'styled-components/native';

const TrafficLight = styled.View`
  borderRadius: 50px;
  height: 10px;
  width: 10px;
  padding: 10px;

  ${(props) =>
    props.available &&
    css`
      background: #afec1a;
    `}

  ${(props) =>
    props.limted &&
    css`
      background: #dde033;
    `}

  ${(props) =>
    props.unavailable &&
    css`
      background: #ec241a;
    `}
`;

export default TrafficLight;
