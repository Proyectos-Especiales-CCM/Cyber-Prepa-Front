import httpInstance from "../httpInstance";

export const readStudents = async () => {
    let res;
    const endpoint = `rental/students`;

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