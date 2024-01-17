import httpInstance from "../httpInstance";

export const readPlays = async (token: string | undefined) => {
    let res;
    const endpoint = `rental/plays/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, {
            headers,
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res;
};