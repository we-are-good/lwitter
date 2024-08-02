import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth, database } from "../routes/firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const Button = styled.button`
  margin-top: 50px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

const GithubBtn = () => {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      onBookMarks();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const onBookMarks = async () => {
    const user = auth.currentUser;
    const UserBookMarksQuery = query(
      collection(database, "profileContents"),
      where("userId", "==", user?.uid)
    );
    const snapshot = await getDocs(UserBookMarksQuery);
    const UserBookMarks = snapshot.docs.map((doc) => {
      const { bookMarks, userId } = doc.data();
      return { bookMarks, userId };
    });
    if (UserBookMarks.length > 0) {
      await addDoc(collection(database, "bookMarks"), {
        userId: user?.uid,
        BookMarks: [],
      });
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Github으로 시작하기
    </Button>
  );
};

export default GithubBtn;
