
// Create Users
import httpInstance from "../httpInstance";

export const refreshToken = async (
    refresh: string,
) => {
     
    let res;
    const endpoint = `token/refresh`;

    const requestBody = {
        refresh: refresh,
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