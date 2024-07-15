import { Unsubscribe } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { database } from "../../routes/firebase";
import TweetContents from "./TweetContents";

export interface TweetType {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  gap: 20px;
  overflow-y: scroll;
  background-color: rgba(237, 246, 249, 1);
  border-radius: 15px;
  padding: 20px;
`;

const TimeLine = () => {
  const [tweets, setTweets] = useState<TweetType[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchWteets = async () => {
      const tweetsQuery = query(
        collection(database, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const documentTweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return { tweet, createdAt, userId, username, photo, id: doc.id };
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const documentTweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { tweet, createdAt, userId, username, photo, id: doc.id };
        });
        setTweets(documentTweets);
      });
    };
    fetchWteets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <TweetContents key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
