import httpInstance from "../httpInstance";

export const createOwedMaterial = async (
    material_id: number,
    amount: number,
    student_id: string,
    token: string,
    delivery_deadline?: string,
) => {
    let res;
    const endpoint = `rental/owed-materials/`;

    const requestBody = {
        material: material_id,
        amount: amount,
        student: student_id,
        delivery_deadline: delivery_deadline,
    }
    console.log(requestBody);

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
