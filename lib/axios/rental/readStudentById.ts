import httpInstance from "../httpInstance";

export const readStudentById = async (studentId: number) => {
    let res;
    const endpoint = `rental/students/?id=${studentId}/`;

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
