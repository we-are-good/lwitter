import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../routes/firebase";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  padding: 50px 0px;
  width: 100%;
  height: 100%;
  max-width: 860px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  background-color: white;
  img {
    width: 30px;
    fill: white;
  }
  &.log-out {
    border-color: tomato;
    background-color: tomato;
  }
`;

const Layout = () => {
  const navigate = useNavigate();
  const onLogOut = async () => {
    const logOutConfirm = confirm("정말 로그아웃 하시겠습니까?");
    if (logOutConfirm) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>
            <img src="/home.svg" />
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>
            <img src="/user.svg" />
          </MenuItem>
        </Link>
        <MenuItem className="log-out" onClick={onLogOut}>
          <img src="/logout.svg" />
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

export default Layout;
