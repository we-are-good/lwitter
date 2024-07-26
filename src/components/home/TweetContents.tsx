import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
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
const EditText = styled.textarea``;

const EditPhoto = styled.input``;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
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
const ContentsRow = styled.div``;

const RightButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const TweetContents = ({ username, photo, tweet, userId, id }: TweetType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tweet);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
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
        const url = await getDownloadURL(result.ref);
        console.log(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditPhoto(null);
      setEditText("");
      setIsEditing(false);
    }
  };
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
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </Avatar>
        <Username>{username}</Username>
      </Column>
      <ContentsRow>
        {isEditing ? <EditPhoto type="file" onChange={onFileChange} /> : null}
        {!isEditing ? (
          <Payload>{tweet}</Payload>
        ) : (
          <EditText value={editText} onChange={onEditChange} />
        )}
        {photo ? <Photo src={photo} /> : null}
      </ContentsRow>
      <RightButtons>
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
      </RightButtons>
    </Wrapper>
  );
};

export default TweetContents;
