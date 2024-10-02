import httpInstance from "../httpInstance";

export const patchUserById = async (
    userId: number,
    token: string,
    {
        email,
        password,
        is_admin,
        theme,
        is_active,
    }: {
        email?: string;
        password?: string;
        is_admin?: boolean;
        theme?: string;
        is_active?: boolean;
    } = {},
) => {
    let res;
    const endpoint = `users/${userId}/`;

    const requestBody = {
        email: email,
        password: password,
        is_admin: is_admin,
        theme: theme,
        is_active: is_active
    }

    await httpInstance
        .patch(endpoint, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};
