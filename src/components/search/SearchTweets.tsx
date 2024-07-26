import { useState } from "react";
import { TimeLineWrapper } from "../../style/homeStyle";
import styled from "styled-components";

import type { TweetType } from "../../utils/types";
import TweetContents from "../home/TweetContents";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../routes/firebase";

const SearchForm = styled.form`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  background-color: rgba(237, 246, 249, 1);
  border-radius: 20px;
`;

const SearchInput = styled.input`
  width: 400px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  border: solid 4px green;
`;

const SearchButton = styled.button`
  width: 70px;
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 10px;
  font-size: 16px;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const SearchTweets = () => {
  const [search, setSearch] = useState("");
  const [tweets, setTweets] = useState<TweetType[]>([]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const tweetSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tweetQuery = query(
      collection(database, "tweets"),
      where("tweet", "==", search),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    console.log("search", search);
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };

  return (
    <>
      <SearchForm onSubmit={(e) => tweetSearch(e)}>
        <SearchInput
          type="text"
          maxLength={20}
          placeholder="검색어를 입력해 주세요."
          value={search}
          onChange={(e) => searchHandler(e)}
          required
        />
        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>
      <TimeLineWrapper>
        {tweets.length > 0
          ? tweets.map((tweet) => <TweetContents key={tweet.id} {...tweet} />)
          : `해당 트윗이 존재하지 않습니다.`}
      </TimeLineWrapper>
    </>
  );
};

export default SearchTweets;
