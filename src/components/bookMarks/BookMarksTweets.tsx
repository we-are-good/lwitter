import { useEffect, useState } from "react";
import { TimeLineWrapper } from "../../style/homeStyle";
import TweetContents from "../home/TweetContents";
import type { TweetType } from "../../utils/types";
import { auth, database } from "../../routes/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const BookMarkstweets = () => {
  const [bookMarks, setBookMarks] = useState<TweetType[]>([]);

  const user = auth.currentUser;
  const fetchBookMarks = async () => {
    try {
      const tweetQuery = query(
        collection(database, "bookMarks"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      const snapshot = await getDocs(tweetQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return { tweet, createdAt, userId, username, photo, id: doc.id };
      });
      setBookMarks(tweets);
    } catch {
      console.error(Error);
    }
  };

  useEffect(() => {
    fetchBookMarks();
  }, []);
  return (
    <TimeLineWrapper>
      {bookMarks.map((tweet) => (
        <TweetContents key={tweet.id} {...tweet} />
      ))}
    </TimeLineWrapper>
  );
};

export default BookMarkstweets;
