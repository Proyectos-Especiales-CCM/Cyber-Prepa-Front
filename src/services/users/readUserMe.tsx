import { UserObject } from "../../store/appContext/types";
import httpInstance from "../httpInstance";
import { ApiResponseSingle, User } from "../types";

export const readUserMe = async (token: string,
    setUser: (userObject: UserObject) => void,
    setIsAdmin: (isAdmin: boolean) => void
): Promise<ApiResponseSingle<User>> => {
    let res;
    const endpoint = `users/me/`;

    await httpInstance
        .get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            res = {
                data: response.data,
                status: response.status,
            };

            localStorage.setItem("user", res.data.id.toString());

            // Obtener los tokens del localStorage
            // const tokensJson = localStorage.getItem("tokens") ?? "";
            // const tokens = JSON.parse(tokensJson);

            // Guardar los datos del usuario en el contexto de la aplicación
            const user = {
                id: res.data.id,
                email: response.data.email,
                isAdmin: response.data.is_admin,
                theme: response.data.theme,
                isActive: response.data.is_active,
            };

            setUser(user);
            setIsAdmin(response.data.is_admin);

        })
        .catch(() => {
            throw new Error("Could not retrieve user data");
        });
    return res || {} as ApiResponseSingle<User>;
};