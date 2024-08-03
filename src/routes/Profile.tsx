import styled from "styled-components";
import Mytweets from "../components/profile/Mytweets";
import Myprofile from "../components/profile/Myprofile";

const Wrapper = styled.article`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 15px;
    border: 5px solid rgba(131, 197, 190, 1);
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(131, 197, 190, 1);
  }
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
