import httpInstance from "../httpInstance";

export const deleteSanctionById = async (token: string, id: number) => {
    let res;
    const endpoint = `rental/sanctions/${id}/`;

    await httpInstance
        .delete(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};