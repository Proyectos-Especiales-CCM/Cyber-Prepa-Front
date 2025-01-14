import httpInstance from "../httpInstance";

export const patchMaterialById = async (
    materialId: number,
    token: string,
    {
        name,
        amount,
        description,
    }: {
        name?: string;
        amount?: number;
        description?: string;
    } = {}
     ) => {
    let res;
    const endpoint = `rental/materials/${materialId}/`;

    const requestBody = {
        name: name,
        amount: amount,
        description: description,
    }

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};