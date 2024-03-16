import httpInstance from "../httpInstance";
import { ApiResponseSingle, APITokens } from "../types";

export const obtainToken = async (
    email: string,
    password: string,
): Promise<ApiResponseSingle<APITokens>> => {
     
    let res;
    const endpoint = `token/`;

    const requestBody = {
          email: email,
          password: password
     }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async (response) => {
            
            res = {
                data: response.data,
                status: response.status,
            };
            
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res || {} as ApiResponseSingle<APITokens>;
};