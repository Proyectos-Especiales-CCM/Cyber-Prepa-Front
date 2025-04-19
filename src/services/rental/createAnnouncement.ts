import httpInstance from "../httpInstance";
import { ApiResponseSingle, Announcement } from "../types";

export const createAnnouncement = async (
    title: string,
    content: string,
    start_at: string,
    end_at: string,
    token: string,
): Promise<ApiResponseSingle<Announcement>> => {
    let res;
    const endpoint = `rental/announcements/`;

    const requestBody = {
        title: title,
        content: content,
        start_at: start_at,
        end_at: end_at,
    }

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
    return res || {} as ApiResponseSingle<Announcement>;
};