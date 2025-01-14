import httpInstance from "../httpInstance";
import { ApiResponseSingle, PlaysPagination } from "../types";

export const getPlaysPagination = async (token: string): Promise<ApiResponseSingle<PlaysPagination>> => {
    let res;
    const endpoint = `rental/plays/pagination/`;

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
                data: response.data,
                status: response.status,
            };
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res || {} as ApiResponseSingle<PlaysPagination>;
};