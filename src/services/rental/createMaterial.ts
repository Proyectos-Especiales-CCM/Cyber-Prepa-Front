import httpInstance from "../httpInstance";

export const createMaterial = async (
    name: string,
    amount: number,
    token: string,
    description?: string,
) => {
    let res;
    const endpoint = `rental/materials/`;

    const requestBody = {
        name: name,
        amount: amount,
        description: description,
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
