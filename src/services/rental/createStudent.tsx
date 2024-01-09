import httpInstance from "../httpInstance";

export const createStudent = async (
    id: string,
    name: string,
    forgoten_id: boolean,
    hash: string
) => {
    let res;
    const endpoint = `rental/students`;

    const requestBody = {
        id: id,
        name: name,
        forgoten_id: forgoten_id,
        hash: hash
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