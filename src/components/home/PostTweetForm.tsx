import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import styled from "styled-components";
import { auth, database, storage } from "../../routes/firebase";
import { TweetType } from "../../utils/types";

const Form = styled.form`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: rgba(237, 246, 249, 1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
`;

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AttachedContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const TextArea = styled.textarea`
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

const AttachMediaButton = styled.label`
  padding: 10px;
  width: 4rem;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
const PostTweetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0] && files[0].size > 1 * 1024 * 1024) {
        alert("1MB 이하의 파일만 첨부할 수 있습니다.");
        setFile(null);
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(database, "tweets"), {
        tweet: tweet,
        createdAt: Date.now(),
        username: user.displayName || "익명",
        userId: user.uid,
        bookMarkUserIds: [] as Array<string>,
      } as TweetType);

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }

      setTweet("");
      setFile(null);
    } catch (e) {
      console.error(Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        placeholder="무슨일이 일어나고 있나요?"
        value={tweet}
        required
      />
      <ButtonsBox>
        <AttachedContent>
          <AttachMediaButton htmlFor="file">
            {file ? "image ok" : "image"}
          </AttachMediaButton>
          <AttachFileInput
            id="file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          <AttachMediaButton>Surveys</AttachMediaButton>
          <AttachMediaButton>video</AttachMediaButton>
        </AttachedContent>
        <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post-Tweet"} />
      </ButtonsBox>
    </Form>
  );
};

export default PostTweetForm;
