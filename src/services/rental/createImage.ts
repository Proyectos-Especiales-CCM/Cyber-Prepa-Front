import httpInstance from "../httpInstance";
import { ApiResponseSingle, Image } from "../types";

export const createImage = async ( token: string, image: File ): Promise<ApiResponseSingle<Image>> => {

    let res;
    const endpoint = `rental/images/`;

    const requestBody = new FormData();
    requestBody.append('image', image);

    await httpInstance
        .post(endpoint, requestBody, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = {
                data: response.data,
                status: response.status,
              };
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
        
    return res || {} as ApiResponseSingle<Image>;
};