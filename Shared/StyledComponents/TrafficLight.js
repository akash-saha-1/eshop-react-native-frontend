import styled, { css } from 'styled-components/native';

const TrafficLight = styled.View`
  height: 10px;
  width: 10px;
  padding: 10px;
  borderRadius: 50px;

  ${(props) =>
    props.available &&
    css`
      background: #afec1a;
    `}

  ${(props) =>
    props.limited &&
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
