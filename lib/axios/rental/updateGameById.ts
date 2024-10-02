import httpInstance from "../httpInstance";

export const updateGameById = async (
    gameId: number,
    name: string,
    show: boolean,
    start_time: Date,
    image: number,
    token: string
     ) => {
    let res;
    const endpoint = `rental/games/?id=${gameId}/`;

    const requestBody = {
        name: name,
        show: show,
        start_time: start_time,
        image: image
    }

    await httpInstance
        .put(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
