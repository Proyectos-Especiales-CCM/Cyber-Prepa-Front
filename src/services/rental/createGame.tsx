import httpInstance from "../httpInstance";

export const createGame = async (
    name: string,
    show: boolean,
    token: string,
    file_route?: string,
) => {
    let res;
    const endpoint = `rental/games/`;

    const requestBody = {
        name: name,
        show: show,
        ...(file_route && { file_route: file_route }),
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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