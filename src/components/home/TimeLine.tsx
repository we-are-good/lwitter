import { Unsubscribe } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../routes/firebase";
import { TimeLineWrapper } from "../../style/homeStyle";
import TweetContents from "./TweetContents";

import type { TweetType } from "../../utils/types";

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
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const documentTweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo, bookMarkUserIds } =
            doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            bookMarkUserIds,
            id: doc.id,
          };
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
    <TimeLineWrapper>
      {tweets.map((tweet) => (
        <TweetContents key={tweet.id} {...tweet} />
      ))}
    </TimeLineWrapper>
  );
};

export default TimeLine;
