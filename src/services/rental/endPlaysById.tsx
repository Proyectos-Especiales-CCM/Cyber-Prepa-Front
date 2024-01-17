import httpInstance from "../httpInstance";

export const endPlaysById = async (
    gameId: number,
    name: string,
    show: boolean,
    start_time: Date,
    file_route: string
     ) => {
    let res;
    const endpoint = `rental/games/?id=${gameId}/end_all_plays/`;

    const requestBody = {
        name: name,
        show: show,
        start_time: start_time,
        file_route: file_route
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
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