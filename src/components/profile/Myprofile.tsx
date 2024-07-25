import { updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, database, storage } from "../../routes/firebase";

const MyprofileWrap = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const BackgroundImg = styled.label`
  width: 654px;
  height: 200px;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;
  background-color: #dbfed2;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundInput = styled.input`
  display: none;
`;

const Background = styled.img`
  width: 100%;
  max-height: 200px;
`;

const ProfileIntroduction = styled.section`
  width: 100%;
  height: 150px;
  background-color: #eeffca;
  border-radius: 20px;
  font-weight: 800;
  color: black;
  display: flex;
  flex-direction: column;
`;

const UserProfile = styled.section`
  position: absolute;
  top: 80px;
  left: 30px;
`;

const AvatarUpload = styled.label`
  width: 200px;
  overflow: hidden;
  height: 200px;
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
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  margin-left: 220px;
  padding: 20px;
  font-size: 22px;
`;

const ProfileContent = styled.div`
  margin-left: 220px;
  padding: 20px;
  font-size: 18px;
`;

const ChangeProfileContent = styled.input``;

const Myprofile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [backGroundImg, setBackGroundImg] = useState<string | null>(null);
  const [profileContent, setProfileContent] = useState("");
  const [isProfileContentChange, setIsProfileContentChange] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && user) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const onBackgroundImgChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = e.target;
    if (files && files.length === 1 && user) {
      const file = files[0];
      const locationRef = ref(storage, `backgroundImg/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const backgroundUrl = await getDownloadURL(result.ref);
      setBackGroundImg(backgroundUrl);
    }
  };

  const profileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileContent(e.target.value);
  };

  const onProfileContentChange = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (profileContent) {
        const profileContentsQuery = query(
          collection(database, "profileContents"),
          where("userId", "==", user?.uid)
        );
        const snapshot = await getDocs(profileContentsQuery);
        const documentProfileContents = snapshot.docs.map((doc) => {
          const { profileContent } = doc.data();
          return { profileContent, id: doc.id };
        });

        const profileContentRef = doc(
          database,
          "profileContents",
          documentProfileContents[0].id
        );
        await updateDoc(profileContentRef, { profileContent });
      }
    } catch {
      console.error(Error);
    } finally {
      setIsProfileContentChange(false);
    }
  };

  const fetchPorileContent = async () => {
    try {
      if (user) {
        const profileContentsQuery = query(
          collection(database, "profileContents"),
          where("userId", "==", user?.uid)
        );
        const snapshot = await getDocs(profileContentsQuery);
        const documentProfileContents = snapshot.docs.map((doc) => {
          const { profileContent } = doc.data();
          return profileContent;
        });
        if (documentProfileContents.length <= 0) {
          await addDoc(collection(database, "profileContents"), {
            profileContent: "프로필을 입력해 주세요",
            userId: user.uid,
          });
          setProfileContent("프로필을 입력해 주세요");
        } else if (documentProfileContents.length > 0) {
          setProfileContent(documentProfileContents[0]);
        }
      }
    } catch {
      console.error(Error);
    }
  };

  useEffect(() => {
    fetchPorileContent();
  }, []);

  return (
    <MyprofileWrap>
      <BackgroundImg htmlFor="backgroundImg">
        {backGroundImg && <Background src={backGroundImg} />}
      </BackgroundImg>
      <BackgroundInput
        id="backgroundImg"
        type="file"
        accept="image/*"
        onChange={onBackgroundImgChange}
      />

      <UserProfile>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
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
        </AvatarUpload>
        <AvatarInput
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
      </UserProfile>

      <ProfileIntroduction>
        <Name>{user?.displayName ? user.displayName : "익명"}</Name>
        <ProfileContent>
          {!isProfileContentChange ? (
            <div onClick={() => setIsProfileContentChange(true)}>
              {profileContent}
            </div>
          ) : (
            <form onSubmit={(e) => onProfileContentChange(e)}>
              <ChangeProfileContent
                type="text"
                value={profileContent}
                onChange={(e) => profileChangeHandler(e)}
              />
              <button type="submit">수정</button>
            </form>
          )}
        </ProfileContent>
      </ProfileIntroduction>
    </MyprofileWrap>
  );
};

export default Myprofile;
