import { useAppContext } from "../../store/appContext/appContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Constants";
import { logInAccess } from "../../services"
import { useState } from "react";
import './login.css';
import { Loading } from "../../components";

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser, setTokens, setIsAdmin } = useAppContext();


  const accessLogin = async () => {
    if (email.length > 0 && password.length > 0) {
      
      // Validación de email con expresión regular
      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValidation) {
        console.log("Email invalido");
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
            console.log("user not found")
            setEmail("")
            setPassword("")
          
          } else {
            console.log("user found")
            navigate(ROUTES.HOME);            
          }
        });
    }
  }
  
  return (
    <>
      <div className="container container-size">
        <div className="row d-flex justify-content-center align-items-center">
          <img src="../../src/assets/loginLogo.svg"/>
        </div>
        <div className="row d-flex justify-content-center align-content-center p-3 form-header">
          Entrar a CyberTec
        </div>
        <div className="container mt-3 p-3 bg-dark.bg-gradient rounded login-container">
          
            
            
            <label htmlFor="username" className="label-container">Correo electrónico</label>
            <input onChange={(event) => setEmail(event.target.value)}
                   type="text" 
                   className="form-control input-block js-login-field rounded" 
                   id="username" 
                   name="username" 
                   placeholder="" 
                   aria-label="Username" 
            />
            
            <div className="position-relative">
              <label className="label-container" htmlFor="password">Contraseña</label>
              <input onChange={(event) => setPassword(event.target.value)}
                     type="password" 
                     name="password" 
                     id="password" 
                     className="form-control input-block rounded" 
              />
              <a href="" className="label-link position-absolute top-0">¿Olvidaste tu contraseña?</a>

              <button onClick={accessLogin}
                      className="btn btn-block sign-in-btn"
                      disabled={isLoading} 
                      value="login">
                        {isLoading ? <Loading /> : 'Ingresar'}
              </button>
            </div>
          
        </div>
      </div>
    </>
  )
}

export default Login
