// Read Users
import httpInstance from "../httpInstance";

export const readUsers = async () => {
    let res;
    const endpoint = `users`;

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