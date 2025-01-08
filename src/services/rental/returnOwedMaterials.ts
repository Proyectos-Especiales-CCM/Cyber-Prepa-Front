import httpInstance from "../httpInstance";

export const returnOwedMaterial = async (
    owed_material_id: number,
    amount: number,
    token: string,
) => {
    let res;
    const endpoint = `rental/owed-materials/${owed_material_id}/return/`;

    const requestBody = {
        amount: amount,
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data);
        });
    return res;
};
