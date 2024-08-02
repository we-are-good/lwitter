import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, database, storage } from "../../routes/firebase";

import type { TweetType } from "../../utils/types";

const Wrapper = styled.article`
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: white;
  border-radius: 15px;
  color: black;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  gap: 20px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const Photo = styled.img`
  width: 100%;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: 70px;
  width: 50px;
`;

const EditButton = styled.button`
  background-color: blue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: 70px;
  width: 50px;
`;
const EditText = styled.textarea`
  border: none;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: black;
  background-color: rgba(216, 243, 220, 1);
  width: 70%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
    font-weight: 700;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const EditPhoto = styled.input``;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  padding: 0px 10px;
`;

const ChangeButton = styled.button`
  background-color: yellow;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: 70px;
  width: 50px;
`;

const Avatar = styled.label`
  width: 75px;
  height: 75px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const BookMarksBtn = styled.div`
  width: 30px;
  height: 30px;
`;

const TweetContents = ({
  username,
  photo,
  tweet,
  userId,
  id,
  bookMarkUserIds,
}: TweetType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tweet);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [isBookMarked, setIsBookMarked] = useState(false);
  const user = auth.currentUser;

  const onDelete = async () => {
    const deleteConfirmMessage = confirm("정말 삭제하시겠습니까?");
    if (!deleteConfirmMessage || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(database, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setIsEditing(true);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      setEditPhoto(null);
    } else if (files) {
      setEditPhoto(files[0]);
    }
  };

  const onCompleteEdition = async () => {
    const editConfirmMessage = confirm("수정을 완료하시겠습니까?");
    if (!editConfirmMessage || user?.uid !== userId || !isEditing) return;
    if (editText.length > 180) {
      return alert("180자 이하로 작성해 주세요.");
    }
    if (editText.length === 0) {
      return alert("빈 트윗은 작성할 수 없습니다.");
    }
    try {
      const messageRef = doc(database, "tweets", id);
      updateDoc(messageRef, { tweet: editText });

      if (editPhoto) {
        if (editPhoto?.size > 1 * 1024 * 1024) {
          return alert("1MB 이하의 파일만 업로드할 수 있습니다.");
        }
        const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
        const result = await uploadBytes(photoRef, editPhoto);
        await getDownloadURL(result.ref);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditPhoto(null);
      setEditText("");
      setIsEditing(false);
    }
  };

  const handleBookMark = async () => {
    if (!user) return;
    try {
      setIsBookMarked(true);
      addTweetBookMark();
      addUserBookMark();
    } catch {
      console.error(Error);
    }
  };

  const deleteBookMark = async () => {
    if (!user) return;
    try {
      setIsBookMarked(false);
      deleteTweetBookMark();
      deleteUserBookMark();
    } catch {
      console.error(Error);
    }
  };

  const deleteTweetBookMark = async () => {
    const tweetRef = doc(database, "tweets", id);
    updateDoc(tweetRef, { bookMarkUserIds: arrayRemove(user?.uid) });
  };

  const addTweetBookMark = async () => {
    const tweetRef = doc(database, "tweets", id);
    const newBookmarkUserIds = [user?.uid];
    updateDoc(tweetRef, { bookMarkUserIds: arrayUnion(...newBookmarkUserIds) });
  };

  const deleteUserBookMark = async () => {
    const userBookMarksQuery = query(
      collection(database, "bookMarks"),
      where("userId", "==", user?.uid)
    );
    const snapshot = await getDocs(userBookMarksQuery);
    const userBookMarks = snapshot.docs.map((doc) => {
      const { bookMarks, userId } = doc.data();
      return { bookMarks, userId, bookMarksId: doc.id };
    });
    const userBookMarksRef = doc(
      database,
      "bookMarks",
      userBookMarks[0].bookMarksId
    );
    updateDoc(userBookMarksRef, { bookMarks: arrayRemove(id) });
  };

  const addUserBookMark = async () => {
    const userBookMarksQuery = query(
      collection(database, "bookMarks"),
      where("userId", "==", user?.uid)
    );
    const snapshot = await getDocs(userBookMarksQuery);
    const userBookMarks = snapshot.docs.map((doc) => {
      const { bookMarks, userId } = doc.data();
      return { bookMarks, userId, bookMarksId: doc.id };
    });
    const userBookMarksRef = doc(
      database,
      "bookMarks",
      userBookMarks[0].bookMarksId
    );
    const newUserBookMarks = [id];
    updateDoc(userBookMarksRef, { bookMarks: arrayUnion(...newUserBookMarks) });
  };

  useEffect(() => {
    if (bookMarkUserIds.find((user) => user === userId)) {
      setIsBookMarked(true);
    }
  }, []);

  return (
    <Wrapper>
      <Column>
        <Avatar>
          {user?.photoURL ? (
            <AvatarImg src={user.photoURL} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Avatar>
        <Username>{username}</Username>
      </Column>
      <div>
        {isEditing ? <EditPhoto type="file" onChange={onFileChange} /> : null}
        {!isEditing ? (
          <Payload>{tweet}</Payload>
        ) : (
          <EditText value={editText} onChange={onEditChange} />
        )}
        {photo ? <Photo src={photo} /> : null}
      </div>
      {user?.uid === userId ? (
        <Buttons>
          <DeleteButton type="button" onClick={onDelete}>
            삭제
          </DeleteButton>
          {!isEditing ? (
            <EditButton type="button" onClick={onEdit}>
              수정
            </EditButton>
          ) : (
            <ChangeButton type="button" onClick={onCompleteEdition}>
              완료
            </ChangeButton>
          )}
        </Buttons>
      ) : null}
      <Buttons>
        <BookMarksBtn onClick={isBookMarked ? deleteBookMark : handleBookMark}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isBookMarked ? "red" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={isBookMarked ? "transparent" : "currentColor"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        </BookMarksBtn>
        <div>{bookMarkUserIds.length}</div>
      </Buttons>
    </Wrapper>
  );
};

export default TweetContents;
