import httpInstance from "../httpInstance";

export const patchGameById = async (
    gameId: number,
    token: string,
    {
        name,
        show,
        start_time,
        image,
    }: {
        name?: string;
        show?: boolean;
        start_time?: Date;
        image?: number;
    } = {}
     ) => {
    let res;
    const endpoint = `rental/games/${gameId}/`;

    const requestBody = {
        name: name,
        show: show,
        start_time: start_time,
        image: image
    }

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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