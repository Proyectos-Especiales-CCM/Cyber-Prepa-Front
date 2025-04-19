import httpInstance from "../httpInstance";

export const deleteAnnouncementById = async (announcementId: number, token: string) => {
    let res;
    const endpoint = `rental/announcements/${announcementId}/`;

    await httpInstance
        .delete(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};