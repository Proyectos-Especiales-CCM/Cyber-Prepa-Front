import httpInstance from "../httpInstance";

export const deleteOwedMaterialById = async (owedMaterialId: number, token: string) => {
    let res;
    const endpoint = `rental/owed-materials/${owedMaterialId}/`;

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