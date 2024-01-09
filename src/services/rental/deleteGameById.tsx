import httpInstance from "../httpInstance";

export const deleteGameById = async (gameId: number) => {
    let res;
    const endpoint = `rental/games/?id=${gameId}`;

    await httpInstance
        .delete(endpoint, {
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