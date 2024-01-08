// Read Users
import httpInstance from "../httpInstance";

export const readUserMe = async () => {
    let res;
    const endpoint = `users/me`;

    await httpInstance
        .get(endpoint, {
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