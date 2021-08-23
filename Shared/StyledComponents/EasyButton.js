import styled, { css } from 'styled-components/native';

const EasyButton = styled.TouchableOpacity`
  flexDirection: row;
  borderRadius: 5px;
  padding: 10px;
  margin: 5px;
  justifyContent: center;
  background: transparent;
  color:white;

  ${(props) =>
    props.primary &&
    css`
      background: #5cb85c;
    `}

  ${(props) =>
    props.secondary &&
    css`
      background: #62b1f6;
    `}

    ${(props) =>
    props.danger &&
    css`
      background: #f40105;
    `}

    ${(props) =>
    props.large &&
    css`
      width: 135px;
    `}

    ${(props) =>
    props.medium &&
    css`
      width: 100px;
    `}

    ${(props) =>
    props.small &&
    css`
      width: 40px;
    `}
`;

export default EasyButton;
