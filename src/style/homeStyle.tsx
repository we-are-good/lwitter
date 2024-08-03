import styled from "styled-components";

export const Wrapper = styled.div`
  display: gird;
  gap: 50px;
  overflow-y: auto;
  grid-template-rows: 1fr 5fr;
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

export const TimeLineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  gap: 20px;
  background-color: rgba(237, 246, 249, 1);
  border-radius: 15px;
  padding: 20px;
  color: black;
`;
