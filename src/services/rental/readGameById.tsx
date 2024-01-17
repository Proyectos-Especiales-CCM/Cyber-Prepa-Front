import httpInstance from "../httpInstance";

export const readGameById = async (gameId: number, 
                                   token?: string | undefined
                                   ) => {
    let res;
    const endpoint = `rental/games/?id=${gameId}/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

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