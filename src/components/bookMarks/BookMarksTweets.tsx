import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, database } from "../../routes/firebase";
import { TimeLineWrapper } from "../../style/homeStyle";
import type { TweetType } from "../../utils/types";
import TweetContents from "../home/TweetContents";

const BookMarkstweets = () => {
  const [bookMarks, setBookMarks] = useState<TweetType[]>([]);

  const user = auth.currentUser;

  const fetchBookMarks = async () => {
    try {
      if (!user) return;
      const userBookMarksQuery = query(
        collection(database, "tweets"),
        where("bookMarkUserIds", "array-contains", user.uid)
      );
      const snapshot = await getDocs(userBookMarksQuery);
      const bookMarkTweets = snapshot.docs.map((doc) => {
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
      setBookMarks(bookMarkTweets);
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
