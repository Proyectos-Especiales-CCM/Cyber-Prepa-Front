import httpInstance from "../httpInstance";
import { ApiResponse, Sanction } from "../types";

export const readSanctions = async (token: string): Promise<ApiResponse<Sanction>> => {
    let res;
    const endpoint = `rental/sanctions/`

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    await httpInstance
        .get(endpoint, {
            headers,
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
    return res || {} as ApiResponse<Sanction>;
};
