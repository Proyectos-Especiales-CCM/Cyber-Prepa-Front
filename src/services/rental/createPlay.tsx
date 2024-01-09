import httpInstance from "../httpInstance";

export const createPlay = async (
    ended: boolean,
    student: string,
    game: number,
) => {
    let res;
    const endpoint = `rental/plays`;

    const requestBody = {
        ended: ended,
        student: student,
        game: game
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