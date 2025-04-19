import { useState } from "react";
import { useAppContext } from "../../store/appContext/useAppContext";
import { Loading } from "../../components";
import { ROUTES } from "../../routes/Constants";
import { useNavigate } from "react-router-dom";
import { logInAccess } from "../../services";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Password, Email } from "@mui/icons-material";
import "./login.css";

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ff0000",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const { setUser, setTokens, setIsAdmin } = useAppContext();

  const accessLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      setFeedbackMessage("Por favor rellena todos los campos");
      return;
    }

    setIsLoading(true);
    setFeedbackMessage(null); // Clear previous messages

    const res = await logInAccess(
      email,
      password,
      setTokens,
      setUser,
      setIsAdmin,
    );
    setIsLoading(false);

    if (res == null) {
      setFeedbackMessage("Por favor revisa tus credenciales.");
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      accessLogin();
    }
  };

  return (
    <div className="main-container">
      <div className="logo-container">
        <img
          src="loginLogo.svg"
          alt=""
          style={{ width: "60%", height: "60%" }}
        />
      </div>
      <div className="form-container">
        <div className="header">
          <div className="header-text">Iniciar sesión</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <ThemeProvider theme={theme}>
            <div className="input">
              <Email
                style={{
                  width: "10%",
                  height: "auto",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                color="primary"
              />
              <input
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={handleKeyPress}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="input">
              <Password
                style={{
                  width: "10%",
                  height: "auto",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                color="primary"
              />
              <input
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={handleKeyPress}
                type="password"
                placeholder="Password"
              />
            </div>
          </ThemeProvider>
        </div>
        {feedbackMessage && (
          <div color="primary" style={{ color: "red", textAlign: "center" }}>
            {feedbackMessage}
          </div>
        )}
        <div className="forgot-password">
          ¿Perdiste tu constraseña? <span onClick={() => alert("Por el momento no esta disponible la funcionalidad de recuperar contraseñas, lamentamos las molestias.")}>¡Haz click aqui!</span>
        </div>
        <div className="submit-container">
          <button
            onClick={accessLogin}
            className={isLoading ? "submit gray" : "submit"}
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
