import httpInstance from "../httpInstance";

export const createUser = async (matricula: string) => {
    let res;
    const endpoint = `addUser`;

    const requestBody = { matricula: matricula };

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