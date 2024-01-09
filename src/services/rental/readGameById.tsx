import httpInstance from "../httpInstance";

export const readGameById = async (gameId: number) => {
    let res;
    const endpoint = `rental/games/?id=${gameId}`;

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