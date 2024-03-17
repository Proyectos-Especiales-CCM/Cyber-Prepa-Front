import { useState } from "react";
import { useAppContext } from "../../store/appContext/useAppContext";
import { Loading } from "../../components";
import { ROUTES } from "../../routes/Constants";
import { useNavigate } from "react-router-dom";
import { logInAccess } from "../../services";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Password, Email } from '@mui/icons-material';
import './login.css';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ff0000',
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser, setTokens, setIsAdmin } = useAppContext();

  const accessLogin = async () => {
    if (email.length > 0 && password.length > 0) {
      // Email validation with regular expression
      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValidation) {
        console.log("Invalid email");
        return;
      }

      setIsLoading(true);

      await logInAccess(
        email,
        password,
        setTokens,
        setUser,
        setIsAdmin,
      ).then(async (res) => {
        setIsLoading(false);

        if (res == null) {
          console.log("User not found")

        } else {
          console.log("User found")
          navigate(ROUTES.HOME);
        }
      });
    }
  }

  return (
    <div className='main-container'>
      <div className='logo-container'>
        <img src="loginLogo.svg" alt="" style={{ width: '200%', height: '200%' }} />
      </div>
      <div className='form-container'>
        <div className="header">
          <div className="text">Iniciar sesión</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <ThemeProvider theme={theme}>
          <div className="input">
            <Email style={{ width: '10%', height: 'auto', marginLeft: '1rem', marginRight: '1rem' }} color="primary" />
            <input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="input">
            <Password style={{ width: '10%', height: 'auto', marginLeft: '1rem', marginRight: '1rem' }} color="primary" />
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          </ThemeProvider>
        </div>
        <div className="forgot-password">¿Perdiste tu constraseña? <span>¡Haz click aqui!</span></div>
        <div className="submit-container">
          <button
          onClick={accessLogin}
          className={isLoading ? "submit gray" : "submit"}
          disabled={isLoading}>
            {isLoading ? <Loading /> : 'Entrar'}
            </button>
            </div>
        </div>
      </div>
  );
};

export default Login;
