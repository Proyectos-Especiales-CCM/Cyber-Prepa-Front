import httpInstance from "../httpInstance";

export const readPlays = async () => {
    let res;
    const endpoint = `rental/plays`;

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