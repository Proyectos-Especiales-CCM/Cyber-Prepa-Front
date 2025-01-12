import httpInstance from "../httpInstance";

export const patchOwedMaterialById = async (
    owedMaterialId: number,
    token: string,
    {
        material,
        amount,
        student,
        delivery_deadline,
    }: {
        material?: number;
        amount?: number;
        student?: string;
        delivery_deadline?: string;
    } = {}
     ) => {
    let res;
    const endpoint = `rental/owed-materials/${owedMaterialId}/`;

    const requestBody = {
        material: material,
        amount: amount,
        student: student,
        delivery_deadline: delivery_deadline,
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