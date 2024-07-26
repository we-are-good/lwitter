import PostTweetForm from "../components/home/PostTweetForm";
import TimeLine from "../components/home/TimeLine";
import { Wrapper } from "../style/homeStyle";

const Home = () => {
  return (
    <Wrapper>
      <PostTweetForm />
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
