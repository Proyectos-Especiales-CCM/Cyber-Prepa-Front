import httpInstance from "../httpInstance";
import { ApiResponse, Announcement } from "../types";

export const patchAnnouncementById = async (
    announcementId: number,
    token: string,
    {
        title,
        content,
        start_at,
        end_at,
    }: {
        title?: string;
        content?: string;
        start_at?: string;
        end_at?: string;
    } = {}
): Promise<ApiResponse<Announcement>> => {
    let res;
    const endpoint = `rental/announcements/${announcementId}/`;

    const requestBody = {
        title: title,
        content: content,
        start_at: start_at,
        end_at: end_at,
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
    return res || {} as ApiResponse<Announcement>;
};