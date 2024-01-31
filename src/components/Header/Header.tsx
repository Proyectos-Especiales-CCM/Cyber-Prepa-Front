import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/appContext/appContext";

const Header = () => {

  const { logOut, user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header style={{ zIndex: 100 }} className="position-sticky top-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">CyberTec</span>
          <div className="d-flex">
            <span className="navbar-text me-2">{user?.email}</span>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  logOut();
                  navigate("/");
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
