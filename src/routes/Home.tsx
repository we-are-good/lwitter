import styled from "styled-components";
import PostTweetForm from "../components/tweet/PostTweetForm";
import TimeLine from "../components/tweet/TimeLine";

const Wrapper = styled.div`
  display: gird;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

const Home = () => {
  return (
    <Wrapper>
      <PostTweetForm />
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
