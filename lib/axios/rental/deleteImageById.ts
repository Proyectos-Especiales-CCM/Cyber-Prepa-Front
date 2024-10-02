import httpInstance from "../httpInstance";

export const deleteImageById = async (imageId: number, token: string) => {
    let res;
    const endpoint = `rental/images/${imageId}/`;

    await httpInstance
        .delete(endpoint, {
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
