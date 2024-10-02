import httpInstance from "../httpInstance";
import { ApiResponse, Sanction } from "../types";

export const readSanctionById = async (token: string, id: number): Promise<ApiResponse<Sanction>> => {
    let res;
    const endpoint = `rental/sanctions/${id}/`;

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
    return res || {} as ApiResponse<Sanction>;
};
