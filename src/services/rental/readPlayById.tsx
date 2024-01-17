import httpInstance from "../httpInstance";

export const readPlayById = async (playId: number) => {
    let res;
    const endpoint = `rental/plays/?id=${playId}/`;

    await httpInstance
        .get(endpoint, {
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