// Create Users
import httpInstance from "../httpInstance";

export const createUser = async (
    email: string,
    password: string,
    is_admin: boolean,
    theme: string,
    is_active: boolean
) => {
    let res;
    const endpoint = `users`;

    const requestBody = {
        email: email,
        password: password,
        is_admin: is_admin,
        theme: theme,
        is_active: is_active  
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res;
};