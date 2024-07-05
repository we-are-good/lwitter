import styled from "styled-components";

const LoadingWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.span`
  font-size: 24px;
`;

const LoadingScreen = () => {
  return (
    <LoadingWrapper>
      <Text>Loading</Text>
    </LoadingWrapper>
  );
};

export default LoadingScreen;
