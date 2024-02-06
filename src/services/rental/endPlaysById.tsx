import httpInstance from "../httpInstance";

export const endPlaysById = async (
    gameId: number,
    token: string,
     ) => {
    let res;
    const endpoint = `rental/games/${gameId}/end-all-plays/`;

    await httpInstance
        .post(endpoint, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res;
};