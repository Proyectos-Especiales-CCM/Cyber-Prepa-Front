import httpInstance from "../httpInstance";
import { ApiResponse, OwedMaterial } from "../types";

export const readOwedMaterials = async (token?: string): Promise<ApiResponse<OwedMaterial>> => {
    let res;
    const endpoint = `rental/owed-materials/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, {
            headers
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

    return res || {} as ApiResponse<OwedMaterial>;
};