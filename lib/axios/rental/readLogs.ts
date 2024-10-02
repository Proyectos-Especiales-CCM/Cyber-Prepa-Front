import httpInstance from "../httpInstance";
import { ApiResponse, Log } from "../types";

export const readLogs = async (token: string, lines?: number): Promise<ApiResponse<Log>> => {
    let res;
    const endpoint = `/logs/${lines ? `?lines=${lines}` : ''}`;

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
    return res || {} as ApiResponse<Log>;
};
