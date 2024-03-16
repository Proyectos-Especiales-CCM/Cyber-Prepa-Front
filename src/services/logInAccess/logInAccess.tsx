import { obtainToken, readUserMe } from "../../services";
import { UserObject } from "../../store/appContext/types";

export const logInAccess = async (
     email: string,
     password: string,
     setTokens: (accessToken: string, refreshToken: string) => void,
     setUser: (userObject: UserObject) => void,
     setIsAdmin: (isAdmin: boolean) => void,
) => {
     try {
          const response = await obtainToken(email, password)

          if (response == undefined) {
               console.error("Could not generate/retrieve tokens");
               return undefined;
          }

          // Obtener los valores de access_token y refresh_token del response
          const accessToken= response.data.access;
          const refreshToken = response.data.refresh;

          // Checa si accessToken o refreshToken es undefined
          if (accessToken === undefined || refreshToken === undefined) {
               console.error("No active account found with the given credentials");
               return undefined;
          }

          // Llamar directamente a setTokens del AppContext para guardar los tokens
          setTokens(accessToken, refreshToken);

          // Crear un objeto JSON con los tokens
          const tokens = {
               access_token: accessToken,
               refresh_token: refreshToken,
          };

          // Guardar el objeto JSON en el almacenamiento local (localStorage)
          localStorage.setItem("tokens", JSON.stringify(tokens));
          localStorage.setItem("email", email);

          const userResponse = await readUserMe(response.data.access, setUser, setIsAdmin)          
                    
          if (userResponse.status === 200) {
               return userResponse.data;
          } else {
               console.log("Unexpected status code:", userResponse.status);
               return undefined;
          }
     } catch (error) {
          console.log("Error:", error);
          return undefined;
     }
};