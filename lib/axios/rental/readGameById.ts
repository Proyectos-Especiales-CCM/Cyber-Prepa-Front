import httpInstance from "../httpInstance";
import { ApiResponseSingle, Game } from "../types";

export const readGameById = async (gameId: number, token?: string | undefined): Promise<ApiResponseSingle<Game>> => {
    let res;
    const endpoint = `rental/games/${gameId}/`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, { headers })
        .then((response) => {
            res = { data: response.data, status: response.status };
        })
        .catch((error) => {
            res = { data: error.response?.data, status: error.response?.status };
        });
    return res || {} as ApiResponseSingle<Game>;
};
