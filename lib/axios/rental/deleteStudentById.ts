import httpInstance from "../httpInstance";

export const deleteStudentById = async (studentId: number) => {
    let res;
    const endpoint = `rental/students/?id=${studentId}/`;

    await httpInstance
        .delete(endpoint, {
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
