import styled from "styled-components";
import Mytweets from "../components/profile/Mytweets";
import Myprofile from "../components/profile/Myprofile";

const Wrapper = styled.article`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
`;

const Profile = () => {
  return (
    <Wrapper>
      <Myprofile />
      <Mytweets />
    </Wrapper>
  );
};

export default Profile;
