import httpInstance from "../httpInstance";
import { ApiResponse, Material } from "../types";

export const readMaterials = async (token?: string): Promise<ApiResponse<Material>> => {
    let res;
    const endpoint = `rental/materials/`;

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

    return res || {} as ApiResponse<Material>;
};