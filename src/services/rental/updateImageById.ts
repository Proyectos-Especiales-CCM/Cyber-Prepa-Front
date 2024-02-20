import httpInstance from "../httpInstance";

export const updateImageById = async (imageId: number, token: string, image: File) => {
    let res;
    const endpoint = `rental/images/${imageId}/`;

    const requestBody = new FormData();
    requestBody.append('image', image);
    
    await httpInstance
        .put(endpoint, requestBody, {
            headers: {
                'Content-Type': 'multipart/form-data',
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