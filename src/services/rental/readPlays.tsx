import httpInstance from "../httpInstance";
import { ApiResponse, Play } from "../types";

export const readPlays = async (token: string, page?: number): Promise<ApiResponse<Play>> => {
    let res;
    const endpoint = `rental/plays/?page=${page ? page : 1}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, {
            headers,
        })
        .then((response) => {
            res = {
                data: response.data.results,
                status: response.status,
            };
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res || {} as ApiResponse<Play>;
};