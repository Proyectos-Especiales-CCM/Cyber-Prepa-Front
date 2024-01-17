import httpInstance from "../httpInstance";

export const readGames = async (token: string | undefined) => {
    let res;
    const endpoint = `rental/games/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    console.log(headers)

    await httpInstance
        .get(endpoint, {
            headers
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });

    return res;
};