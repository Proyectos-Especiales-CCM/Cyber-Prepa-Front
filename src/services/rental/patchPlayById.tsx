import httpInstance from "../httpInstance";

export const patchPlayById = async (
    playId: number,
    token: string,
    {
        ended,
        game,
    }: {
        ended?: boolean,
        game?: number
    } = {}
) => {
    let res;
    const endpoint = `rental/plays/${playId}/`;

    const requestBody = {
        ended: ended,
        game: game
    }

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};