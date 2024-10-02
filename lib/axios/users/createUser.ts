import httpInstance from "../httpInstance";

export const createUser = async (
    email: string,
    password: string,
    token: string,
    is_admin?: boolean,
    theme?: string,
    is_active?: boolean
) => {
    let res;
    const endpoint = `users/`;

    const requestBody = {
        email: email,
        password: password,
        is_admin: is_admin,
        theme: theme,
        is_active: is_active  
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    await httpInstance
        .post(endpoint, JSON.stringify(requestBody), {
            headers: headers,
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res;
};
