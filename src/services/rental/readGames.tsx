import httpInstance from "../httpInstance";
import { ApiResponse, Game } from "../types";

export const readGames = async (token?: string): Promise<ApiResponse<Game>> => {
    let res;
    const endpoint = `rental/games/`;

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
            res = error.response;
        });

    return res || {} as ApiResponse<Game>;
};