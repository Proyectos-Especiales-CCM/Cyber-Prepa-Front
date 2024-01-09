import httpInstance from "../httpInstance";

export const patchPlayById = async (
    playId: number,
    ended: boolean,
    student: string,
    game: number,
) => {
    let res;
    const endpoint = `rental/plays/id=${playId}`;

    const requestBody = {
        ended: ended,
        student: student,
        game: game
    }

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
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