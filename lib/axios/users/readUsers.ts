import httpInstance from "../httpInstance";
import { ApiResponse, User } from "../types";

export const readUsers = async (access_token: string): Promise<ApiResponse<User>> => {
    let res;
    const endpoint = `users/`;

    await httpInstance
        .get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
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
    return res || {} as ApiResponse<User>;
};
