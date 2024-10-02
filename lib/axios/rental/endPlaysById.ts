import httpInstance from "../httpInstance";
import { ApiResponse, EndPlayResponse } from "../types";

export const endPlaysById = async (
    gameId: number,
    token: string,
    ): Promise<ApiResponse<EndPlayResponse>> => {
    let res;
    const endpoint = `rental/games/${gameId}/end-all-plays/`;

    await httpInstance
        .post(endpoint, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res || {} as ApiResponse<EndPlayResponse>;
};
