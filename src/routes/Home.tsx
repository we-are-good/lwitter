import { auth } from "./firebase";

const Home = () => {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <>
      <div>home</div>
      <button onClick={logOut}>Log out</button>
    </>
  );
};

export default Home;
