// Read Users
import httpInstance from "../httpInstance";

export const readUserById = async (userId: number) => {
    let res;
    const endpoint = `users/?id=${userId}`;

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