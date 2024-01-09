import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/appContext/appContext";

const Header = () => {

  const { logOut, user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header style={{ zIndex: 100 }} className="position-sticky top-0">
      HEADER 😇
    </header>
  );
};

export default Header;
