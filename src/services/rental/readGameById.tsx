import httpInstance from "../httpInstance";
import { ApiResponse, Game } from "../types";

export const readGameById = async (gameId: number, 
                                   token?: string | undefined
                                   ): Promise<ApiResponse<Game>> => {
    let res;
    const endpoint = `rental/games/?id=${gameId}/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, {
            headers
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res || {} as ApiResponse<Game>;
};