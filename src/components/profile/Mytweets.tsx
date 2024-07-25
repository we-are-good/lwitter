import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import TweetContents from "../tweet/TweetContents";
import { auth, database } from "./../../routes/firebase";

import type { TweetType } from "../tweet/TimeLine";

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Mytweets = () => {
  const user = auth.currentUser;
  const [currentUserTweets, setCurrentUserTweets] = useState<TweetType[]>([]);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(database, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });

    setCurrentUserTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Tweets>
      {currentUserTweets.map((tweet) => (
        <TweetContents key={tweet.id} {...tweet} />
      ))}
    </Tweets>
  );
};

export default Mytweets;
