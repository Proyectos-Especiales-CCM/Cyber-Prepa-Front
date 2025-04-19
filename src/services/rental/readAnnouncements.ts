import httpInstance from "../httpInstance";
import { ApiResponse, Announcement } from "../types";

export const readAnnouncements = async (token?: string, showOnlyActive?: boolean): Promise<ApiResponse<Announcement>> => {
    let res;
    const params = new URLSearchParams();
    
    if (showOnlyActive !== undefined) {
        params.append("only-active", showOnlyActive.toString());
    }

    const endpoint = `rental/announcements/${params.toString() ? `?${params.toString()}` : ""}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    await httpInstance
        .get(endpoint, {
            headers,
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
