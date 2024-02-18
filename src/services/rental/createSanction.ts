import httpInstance from "../httpInstance";
import { ApiResponse, Sanction } from "../types";

export const createSanction = async (
    token: string,
    cause: string,
    end_time: string,
    student: string,
    play?: number,
): Promise<ApiResponse<Sanction>> => {
    let res;
    const endpoint = `rental/sanctions/`;

    const requestBody = {
        cause: cause,
        end_time: end_time,
        student: student,
        play: play,
    };

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
    return res || {} as ApiResponse<Sanction>;
};