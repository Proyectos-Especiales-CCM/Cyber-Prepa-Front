import httpInstance from "../httpInstance";

export const updateUserById = async (
          userId: number,
          email: string,
          password: string,
          is_admin: boolean,
          theme: string,
          is_active: boolean
     ) => {
    let res;
    const endpoint = `users/?id=${userId}/`;

    const requestBody = {
          email: email,
          password: password,
          is_admin: is_admin,
          theme: theme,
          is_active: is_active  
     }

    await httpInstance
        .put(endpoint, JSON.stringify(requestBody), {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            res = response;
        })
        .catch((error) => {
            res = error.response;
        });
    return res;
};