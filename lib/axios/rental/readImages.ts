import httpInstance from "../httpInstance";
import { ApiResponse, Image } from "../types";

export const readImages = async (token: string): Promise<ApiResponse<Image>> => {
    let res;
    const endpoint = `rental/images/`;

    await httpInstance
        .get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
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
    return res || {} as ApiResponse<Image>;
};
