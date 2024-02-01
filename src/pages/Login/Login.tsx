import { useState } from "react";
import { useAppContext } from "../../store/appContext/appContext";
import { CyberPrepaLogo, Loading } from "../../components";
import { ROUTES } from "../../routes/Constants";
import { useNavigate } from "react-router-dom";
import { logInAccess } from "../../services";
import './login.css';



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
          setEmail("")
          setPassword("")

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
        <img src="../../src/assets/loginLogo.svg" alt="" style={{ width: '200%', height: '200%' }} />
      </div>
      <div className='form-container'>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src="../../src/assets/email.png" alt="" style={{ width: '10%', height: 'auto' }} />
            <input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="input">
            <img src="../../src/assets/password.png" alt="" style={{ width: '10%', height: 'auto' }} />
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
        <div className="submit-container">
          <button
          onClick={accessLogin}
          className={isLoading ? "submit gray" : "submit"}
          disabled={isLoading}>
            {isLoading ? <Loading /> : 'Login'}
            </button>
            </div>
        </div>
      </div>
  );
};

export default Login;
