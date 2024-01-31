import httpInstance from "../httpInstance";
import { ApiResponse, Sanction } from "../types";

export const patchSanctionById = async (
    token: string,
    id: number,
    {
        cause,
        end_time,
        start_time,
        play,
        student,
    }: {
        cause?: string;
        start_time?: Date;
        end_time?: Date;
        play?: number;
        student?: string;
    } = {}
): Promise<ApiResponse<Sanction>> => {
    let res;
    const endpoint = `rental/sanctions/${id}/`;

    const requestBody = {
        cause: cause,
        end_time: end_time,
        start_time: start_time,
        student: student,
        play: play,
    };

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
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