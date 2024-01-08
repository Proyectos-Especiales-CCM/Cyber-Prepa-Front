
// Create Users
import httpInstance from "../httpInstance";

export const obtainToken = async (
    email: string,
    password: string,
) => {
     
    let res;
    const endpoint = `token`;

    const requestBody = {
          email: email,
          password: password
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