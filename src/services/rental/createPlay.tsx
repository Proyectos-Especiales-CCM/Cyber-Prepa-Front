import httpInstance from "../httpInstance";
import { PlayResponse } from "../types";

interface Payload {
    ended: boolean,
    student: string,
    game: number,
}

export const createPlay = async ( ended: boolean, student: string, game: number, token: string ): Promise<PlayResponse> => {

    let res;
    const endpoint = `rental/plays/`;

    const requestBody: Payload = {
        ended: ended,
        student: student,
        game: game
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = {
                detail: response.data,
                status: response.status,
              };
        })
        .catch((error) => {
            res = {
                detail: error.response.data.detail,
                status: error.response.status
            }
        });
        
    return res || {} as PlayResponse;
};